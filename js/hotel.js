/* =========================================================
   POSADA REMBRANDT — Virtual Hotel Tour (Three.js r128)
   Two floors · staircase you can climb · bar with a waiter ·
   receptionist · 4 guest rooms · WASD + mouse · inspect ·
   guided auto-tour (door-by-door, never through walls) ·
   in-browser video + photo capture. Procedural & self-contained.
   ========================================================= */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') {
    var ll=document.getElementById('loadingLbl'); if(ll) ll.textContent='Error: 3D engine failed to load.';
    return;
  }

  /* ---------------- i18n ---------------- */
  var LANG = (localStorage.getItem('viaje_lang') === 'es') ? 'es' : 'en';
  var T = {
    en: { back:'Back to site', sub:'Virtual Hotel Tour · 3D', auto:'Auto tour', autoStop:'Stop tour',
      record:'Record', recording:'Stop rec', photo:'Photo', inspect:'Inspect', enter:'Click to enter',
      watch:'Watch auto tour', building:'Building the hotel…', move:'move', look:'look around',
      doInspect:'inspect', run:'run', jump:'jump', component:'COMPONENT',
      lead:'An interactive two-storey 3D hotel you can walk through. Move with the keyboard, look with the mouse, climb the stairs and inspect every component — staff included. Or let the automatic tour drive, and record it as a video.' },
    es: { back:'Volver al sitio', sub:'Recorrido virtual del hotel · 3D', auto:'Tour automático', autoStop:'Detener tour',
      record:'Grabar', recording:'Detener', photo:'Foto', inspect:'Inspeccionar', enter:'Haz clic para entrar',
      watch:'Ver tour automático', building:'Construyendo el hotel…', move:'moverte', look:'mirar',
      doInspect:'inspeccionar', run:'correr', jump:'saltar', component:'COMPONENTE',
      lead:'Un hotel 3D de dos pisos por el que puedes caminar. Muévete con el teclado, mira con el mouse, sube las escaleras e inspecciona cada componente — incluido el personal. O deja que el recorrido automático conduzca, y grábalo en video.' }
  };
  function tr(k){ return (T[LANG] && T[LANG][k]) || T.en[k] || k; }

  /* ---------------- renderer / scene / camera ---------------- */
  var canvas = document.getElementById('scene');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference:'high-performance', preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;

  var scene = new THREE.Scene();
  var skyTex;
  (function(){
    var c=document.createElement('canvas'); c.width=16; c.height=256; var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,0,256);
    g.addColorStop(0,'#6f9cbe'); g.addColorStop(0.5,'#aebfcd'); g.addColorStop(0.78,'#e6d2b0'); g.addColorStop(1,'#f2dcb6');
    x.fillStyle=g; x.fillRect(0,0,16,256);
    skyTex=new THREE.CanvasTexture(c); skyTex.encoding=THREE.sRGBEncoding; scene.background=skyTex;
  })();
  scene.fog = new THREE.Fog(0xcdc6b8, 48, 150);
  (function(){ try{ var p=new THREE.PMREMGenerator(renderer); p.compileEquirectangularShader();
    scene.environment=p.fromEquirectangular(skyTex).texture; }catch(e){} })();

  var camera = new THREE.PerspectiveCamera(72, window.innerWidth/window.innerHeight, 0.05, 500);

  /* ---------------- lights ---------------- */
  scene.add(new THREE.HemisphereLight(0xeaf0f8, 0x5c4a36, 0.62));
  var sun = new THREE.DirectionalLight(0xffe9c4, 1.85);            // warm golden-hour key
  sun.position.set(40, 56, 34); sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near=1; sun.shadow.camera.far=200;
  sun.shadow.camera.left=-70; sun.shadow.camera.right=70; sun.shadow.camera.top=70; sun.shadow.camera.bottom=-70;
  sun.shadow.bias=-0.0003; sun.shadow.normalBias=0.02; scene.add(sun);
  var fill=new THREE.DirectionalLight(0xaecbe8,0.42); fill.position.set(-30,24,-30); scene.add(fill);   // cool sky fill
  var rim=new THREE.DirectionalLight(0xffd9a8,0.35); rim.position.set(-12,18,-40); scene.add(rim);      // warm back-rim

  /* ---------------- helpers ---------------- */
  function mat(color, rough, metal){ return new THREE.MeshStandardMaterial({ color:color, roughness:rough==null?0.85:rough, metalness:metal==null?0:metal }); }
  function box(w,h,d,m){ var me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); me.castShadow=true; me.receiveShadow=true; return me; }
  function canvasTex(size, draw, repeat){
    var c=document.createElement('canvas'); c.width=c.height=size; draw(c.getContext('2d'),size);
    var t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping;
    if(repeat) t.repeat.set(repeat[0],repeat[1]); t.anisotropy=4; t.encoding=THREE.sRGBEncoding; return t;
  }
  // draw centred text scaled DOWN until it fits maxW (fixes the "T sticking out" overflow)
  function fitText(ctx, text, cx, cy, maxW, startPx, color){
    var px=startPx; ctx.font='bold '+px+'px Georgia, serif';
    while(ctx.measureText(text).width>maxW && px>8){ px-=2; ctx.font='bold '+px+'px Georgia, serif'; }
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=color; ctx.fillText(text,cx,cy);
  }
  // text texture on a transparent canvas sized to the aspect of its plane (wide → no overflow)
  function labelTex(text, wPx, hPx, color){
    var c=document.createElement('canvas'); c.width=wPx; c.height=hPx; var x=c.getContext('2d');
    fitText(x, text, wPx/2, hPx/2, wPx*0.92, Math.floor(hPx*0.7), color||'#e2a93e');
    var t=new THREE.CanvasTexture(c); t.anisotropy=4; t.encoding=THREE.sRGBEncoding; return t;
  }

  var PAL = { sand:0xcaa775, sandDark:0xb08f5e, cream:0xece0cd, wood:0x6e4a2c, woodDark:0x4f351f,
    terra:0xc25a33, gold:0xd8a23a, marble:0xe8e0d2, dark:0x2a2027 };

  var WALLS = [];            // AABB colliders for horizontal blocking
  var FLOORS = [];           // meshes the down-ray walks on (floors + stairs)
  var INTERACTABLES = [];
  var ANIM = [];             // animated characters {update(t)}
  function addCollider(cx,cz,w,d){ WALLS.push({x1:cx-w/2,x2:cx+w/2,z1:cz-d/2,z2:cz+d/2}); }
  function tagObject(obj, info){ obj.userData.info=info; INTERACTABLES.push(obj); obj.traverse(function(o){o.userData.root=obj;}); }
  var world = new THREE.Group(); scene.add(world);

  /* ---------------- textures / materials ---------------- */
  var groundTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#b6a079'; ctx.fillRect(0,0,s,s);
    for(var i=0;i<2400;i++){ ctx.fillStyle='rgba('+(150+Math.random()*40|0)+','+(130+Math.random()*40|0)+',95,.5)'; ctx.fillRect(Math.random()*s,Math.random()*s,2,2);} }, [50,50]);
  var plazaTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#cdb79a'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(90,70,50,.35)'; ctx.lineWidth=3; for(var i=0;i<=s;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,s);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(s,i);ctx.stroke();} }, [10,10]);
  var facadeTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#caa775'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(120,95,62,.30)'; ctx.lineWidth=2; for(var y=0;y<s;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(s,y);ctx.stroke();}
    for(var i=0;i<700;i++){ ctx.fillStyle='rgba('+(170+Math.random()*40|0)+',140,95,.25)'; ctx.fillRect(Math.random()*s,Math.random()*s,3,3);} }, [4,3]);
  var wallTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#ece0cd'; ctx.fillRect(0,0,s,s);
    for(var i=0;i<3000;i++){ var v=210+Math.random()*30|0; ctx.fillStyle='rgba('+v+','+(v-12)+','+(v-30)+',.18)'; ctx.fillRect(Math.random()*s,Math.random()*s,2,2);} }, [3,2]);
  function woodTex(base,line){ return canvasTex(256, function(ctx,s){ ctx.fillStyle=base; ctx.fillRect(0,0,s,s);
    for(var y=0;y<s;y+=3){ ctx.strokeStyle='rgba('+line+','+(0.05+Math.random()*0.12)+')'; ctx.beginPath(); ctx.moveTo(0,y);
      for(var xx=0;xx<=s;xx+=16){ ctx.lineTo(xx,y+Math.sin((xx+y)*0.05)*3);} ctx.stroke(); } }, [2,2]); }
  var marbleTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#e8e0d2'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(150,140,120,.3)'; ctx.lineWidth=2; for(var i=0;i<=s;i+=64){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,s);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(s,i);ctx.stroke();}
    ctx.strokeStyle='rgba(120,110,95,.18)'; for(var k=0;k<40;k++){ctx.beginPath();ctx.moveTo(Math.random()*s,Math.random()*s);ctx.bezierCurveTo(Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s);ctx.stroke();} }, [5,4]);
  var carpetTex = canvasTex(128, function(ctx,s){ ctx.fillStyle='#7a342a'; ctx.fillRect(0,0,s,s);
    for(var i=0;i<900;i++){ ctx.fillStyle='rgba('+(120+Math.random()*40|0)+',50,40,.4)'; ctx.fillRect(Math.random()*s,Math.random()*s,2,2);} }, [12,12]);

  var facadeMat=new THREE.MeshStandardMaterial({map:facadeTex,roughness:.95});
  var creamMat =new THREE.MeshStandardMaterial({map:wallTex,roughness:.92,envMapIntensity:.5});
  var marbleMat=new THREE.MeshStandardMaterial({map:marbleTex,roughness:.22,metalness:.18,envMapIntensity:1.1});
  var woodMat  =new THREE.MeshStandardMaterial({map:woodTex('#6e4a2c','60,38,20'),roughness:.55,metalness:.04,envMapIntensity:.6});
  var woodDarkMat=new THREE.MeshStandardMaterial({map:woodTex('#4f351f','38,24,12'),roughness:.5,metalness:.05,envMapIntensity:.6});
  var carpetMat=new THREE.MeshStandardMaterial({map:carpetTex,roughness:1});
  var goldMat  =new THREE.MeshStandardMaterial({color:PAL.gold,roughness:.24,metalness:.96,envMapIntensity:1.35});
  var terraMat =new THREE.MeshStandardMaterial({color:PAL.terra,roughness:.7,envMapIntensity:.5});
  var roomTex=canvasTex(256,function(ctx,s){ ctx.fillStyle='#7a5436'; ctx.fillRect(0,0,s,s);
    for(var y=0;y<s;y+=18){ ctx.fillStyle='rgba(40,26,14,.28)'; ctx.fillRect(0,y,s,2);} for(var i=0;i<1300;i++){ ctx.fillStyle='rgba('+(110+Math.random()*50|0)+',72,42,.3)'; ctx.fillRect(Math.random()*s,Math.random()*s,2,2);} },[6,6]);
  var roomMat=new THREE.MeshStandardMaterial({map:roomTex,roughness:.75,envMapIntensity:.35});

  /* ---------------- ground, plaza ---------------- */
  var ground=new THREE.Mesh(new THREE.PlaneGeometry(360,360), new THREE.MeshStandardMaterial({map:groundTex,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; world.add(ground); FLOORS.push(ground);
  var plaza=new THREE.Mesh(new THREE.PlaneGeometry(40,24), new THREE.MeshStandardMaterial({map:plazaTex,roughness:.92}));
  plaza.rotation.x=-Math.PI/2; plaza.position.set(0,0.02,12); plaza.receiveShadow=true; world.add(plaza); FLOORS.push(plaza);

  /* ---------------- building shell ----------------
     interior x[-12,12], z[-20,0]. FH=floor height. */
  var FH=4.0, WT=0.4, OPEN=3.0, H1=FH, H2=8.0;
  function floorSlab(cx,cz,w,d,y,m){ var f=new THREE.Mesh(new THREE.PlaneGeometry(w,d), m); f.rotation.x=-Math.PI/2; f.position.set(cx,y+0.02,cz); f.receiveShadow=true; world.add(f); FLOORS.push(f); return f; }

  // wall along X at fixed z, optional gap; h height, baseY bottom
  function wallX(z,x0,x1,gap,m,h,baseY){ h=h||H1; m=m||creamMat; baseY=baseY||0;
    var segs= gap?[[x0,gap[0]],[gap[1],x1]]:[[x0,x1]];
    segs.forEach(function(s){ var w=s[1]-s[0]; if(w<=0.02)return; var cx=(s[0]+s[1])/2;
      var me=box(w,h,WT,m); me.position.set(cx,baseY+h/2,z); world.add(me); addCollider(cx,z,w,WT); });
    if(gap){ var lw=gap[1]-gap[0]; var lin=box(lw,h-OPEN,WT,m); lin.position.set((gap[0]+gap[1])/2,baseY+OPEN+(h-OPEN)/2,z); world.add(lin); }
  }
  function wallZ(x,z0,z1,gap,m,h,baseY){ h=h||H1; m=m||creamMat; baseY=baseY||0;
    var segs= gap?[[z0,gap[0]],[gap[1],z1]]:[[z0,z1]];
    segs.forEach(function(s){ var d=s[1]-s[0]; if(d<=0.02)return; var cz=(s[0]+s[1])/2;
      var me=box(WT,h,d,m); me.position.set(x,baseY+h/2,cz); world.add(me); addCollider(x,cz,WT,d); });
    if(gap){ var ld=gap[1]-gap[0]; var lin=box(WT,h-OPEN,ld,m); lin.position.set(x,baseY+OPEN+(h-OPEN)/2,(gap[0]+gap[1])/2); world.add(lin); }
  }

  // ground floor slab (lobby + back)
  floorSlab(0,-10,24,20, 0, marbleMat);
  // back-half carpet (rooms/corridor feel) on top is fine as marble; rooms get their own.

  // outer walls — front facade tall (to H2), entrance gap
  wallX(0,-12,12,[-2.3,2.3],facadeMat,H2);              // front, double height (wider entrance)
  wallZ(-12,-20,0,null,facadeMat,H2);                   // west outer
  wallZ( 12,-20,0,null,facadeMat,H2);                   // east outer
  wallX(-20,-12,12,null,facadeMat,H2);                  // back outer

  // entrance canopy + sign
  var canopy=box(5.4,0.3,2.4,terraMat); canopy.position.set(0,OPEN+0.15,1.1); world.add(canopy);
  var p1=box(0.25,OPEN,0.25,woodDarkMat); p1.position.set(-2.4,OPEN/2,2.1); world.add(p1);
  var p2=p1.clone(); p2.position.x=2.4; world.add(p2);
  var winMat=new THREE.MeshStandardMaterial({color:0x21262e,roughness:.1,metalness:.2,emissive:0xffd98a,emissiveIntensity:.18});
  // facade windows (two rows)
  for(var wy=0;wy<2;wy++) for(var wx=-9;wx<=9;wx+=3){
    if(wy===0 && Math.abs(wx)<2.2) continue;
    var fr=box(1.9,2.3,0.16,woodDarkMat); fr.position.set(wx, 3.0+wy*2.7, 0.05); world.add(fr);
    var gl=box(1.6,2.0,0.12,winMat); gl.position.set(wx,3.0+wy*2.7,0.16); world.add(gl);
  }
  var signTex=labelTex('POSADA REMBRANDT',1024,200,'#e2a93e');
  var signPanel=box(6.6,1.1,0.18,mat(PAL.dark,.6)); signPanel.position.set(0,OPEN+1.0,0.2); world.add(signPanel);
  var signText=new THREE.Mesh(new THREE.PlaneGeometry(6.3,1.5), new THREE.MeshStandardMaterial({map:signTex,transparent:true,emissive:0xe2a93e,emissiveIntensity:.5,emissiveMap:signTex})); signText.position.set(0,OPEN+1.0,0.32); world.add(signText);
  tagObject(signPanel,{ name:{en:'Hotel facade & sign',es:'Fachada y letrero del hotel'},
    desc:{en:'A two-storey sandstone facade in the warm Guanajuato palette, with a terracotta canopy and a gold-lit sign. The lit windows mark the guest rooms upstairs.',
      es:'Una fachada de cantera de dos niveles en la paleta cálida de Guanajuato, con marquesina de terracota y letrero iluminado en dorado. Las ventanas encendidas marcan las habitaciones del piso de arriba.'},
    note:{en:'Walk inside and climb the stairs — both floors are explorable.',es:'Entra y sube las escaleras — ambos pisos son explorables.'} });

  /* ---------------- second-floor slab + ground ceiling over back ---------------- */
  // back half (z[-20,-8.5]) has a slab at y=FH (upper floor) — front lobby stays double-height
  var slab=box(24,0.3,11.5, mat(0xddd2bf,.9)); slab.position.set(0,FH-0.15,-14.25); slab.receiveShadow=true; world.add(slab);
  floorSlab(0,-14.25,24,11.5, FH, marbleMat);                       // walkable upper floor surface
  // roof over lobby (front) + over upper floor
  var roof=box(24.6,0.3,20.6, mat(0xcdbfa6,.95)); roof.position.set(0,H2,-10); world.add(roof);

  /* ---------------- GRAND STAIRCASE (walkable) ---------------- */
  (function(){
    var steps=13, rise=FH/steps, run=0.34, width=3.4, zb=-5.0, cx=0;  // wider staircase
    var g=new THREE.Group();
    for(var i=0;i<steps;i++){ var st=box(width,rise,run, marbleMat); st.position.set(cx, rise*(i+0.5), zb - run*(i+0.5)); g.add(st); FLOORS.push(st); }
    // side stringers (also block side, low colliders)
    var topZ=zb-run*steps;
    var rampL=box(0.25,0.9,Math.abs(topZ-zb)+0.4, goldMat); rampL.position.set(cx-width/2-0.1, FH*0.5+0.6, (zb+topZ)/2); rampL.rotation.x=-Math.atan2(FH,Math.abs(topZ-zb)); g.add(rampL);
    var rampR=rampL.clone(); rampR.position.x=cx+width/2+0.1; g.add(rampR);
    g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    // colliders along the two sides so you don't fall off
    addCollider(cx-width/2-0.2,(zb+topZ)/2,0.3,Math.abs(topZ-zb)); addCollider(cx+width/2+0.2,(zb+topZ)/2,0.3,Math.abs(topZ-zb));
    tagObject(g.children[6],{ name:{en:'Grand staircase',es:'Escalera principal'},
      desc:{en:'A marble staircase with brass railings rising from the lobby to the upper floor. Walk straight up it — the camera climbs the real steps. A nod to the 113-step stairway of the University of Guanajuato.',
        es:'Una escalera de mármol con barandales de latón que sube del vestíbulo al piso superior. Súbela caminando — la cámara sube los escalones reales. Un guiño a la escalinata de 113 escalones de la Universidad de Guanajuato.'},
      note:{en:'',es:''} });
  })();

  // mezzanine railing along z=-8.5 (front edge of upper slab), gap for the stairs
  (function(){
    var posts=[]; var y=FH+0.5;
    function railSeg(x0,x1){ var w=x1-x0; var rail=box(w,0.12,0.12,goldMat); rail.position.set((x0+x1)/2,FH+0.95,-8.5); world.add(rail);
      var glass=box(w,0.85,0.06, new THREE.MeshStandardMaterial({color:0xbcd0dc,roughness:.05,metalness:.2,transparent:true,opacity:.28,envMapIntensity:1.2})); glass.position.set((x0+x1)/2,FH+0.5,-8.5); world.add(glass);
      addCollider((x0+x1)/2,-8.5,w,0.3); }
    railSeg(-12,-1.7); railSeg(1.7,12);
    // wall along z=-8.5 below the slab? back rooms wall handled separately
  })();

  /* ---------------- GROUND BACK: corridor + 2 rooms ---------------- */
  // partition at z=-8.5 (ground): solid segments leaving two archway openings
  // (west door x[-7,-5], east door x[5,7])
  wallX(-8.5,-12,-7.5,null,creamMat,H1);
  wallX(-8.5,-4.5,4.5,null,creamMat,H1);
  wallX(-8.5, 7.5,12,null,creamMat,H1);
  floorSlab(0,-9.75,24,3.5, 0.06, carpetMat);                 // wider corridor underfoot
  // room dividing wall x=0 between the two ground rooms (z[-20,-11])
  wallZ(0,-20,-11,[-16.5,-13.5],creamMat,H1);
  // ground room floors
  floorSlab(-6,-15.5,11,9, 0.06, roomMat);
  floorSlab( 6,-15.5,11,9, 0.06, roomMat);

  /* ---------------- UPPER FLOOR: corridor + 2 rooms ---------------- */
  // outer upper walls (z=-8.5 front has railing; back/sides are the outer facade up to H2 already)
  // upper partition at z=-11: two archway openings (west x[-7.4,-5.4], east x[5.4,7.4])
  wallX(-11,-12,-7.6,null,creamMat,H1,FH);
  wallX(-11,-4.6,4.6,null,creamMat,H1,FH);
  wallX(-11,7.6,12,null,creamMat,H1,FH);
  // upper room divider x=0
  wallZ(0,-20,-11,[-16.5,-13.5],creamMat,H1,FH);
  // upper room/corridor floors already covered by slab top; add carpet upper corridor
  floorSlab(0,-9.6,24,2.0, FH+0.06, carpetMat);
  floorSlab(-6,-15.5,11,8.5, FH+0.06, roomMat);
  floorSlab( 6,-15.5,11,8.5, FH+0.06, roomMat);
  // simple ceiling over upper rooms is the roof (H2)

  /* ---------------- RECEPTION DESK + RECEPTIONIST ---------------- */
  (function(){
    var g=new THREE.Group();
    var base=box(5,1.1,1.3,woodMat); base.position.set(0,0.55,0); g.add(base);
    var wing=box(1.3,1.1,3.0,woodMat); wing.position.set(-3.1,0.55,1.4); g.add(wing);
    var top=box(5.4,0.12,1.6,mat(PAL.dark,.3,.1)); top.position.set(0,1.16,0); g.add(top);
    var top2=box(1.6,0.12,3.2,mat(PAL.dark,.3,.1)); top2.position.set(-3.1,1.16,1.4); g.add(top2);
    var front=box(5,0.9,0.06,goldMat); front.position.set(0,0.6,0.66); g.add(front);
    var board=box(4.4,2.0,0.14,woodDarkMat); board.position.set(0,2.0,-1.0); g.add(board);
    var logoT=labelTex('RECEPTION',640,256,'#e2a93e');
    var logo=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.3), new THREE.MeshStandardMaterial({map:logoT,transparent:true,emissive:0xe2a93e,emissiveIntensity:.4,emissiveMap:logoT})); logo.position.set(0,2.1,-0.9); g.add(logo);
    var bell=new THREE.Mesh(new THREE.SphereGeometry(0.14,16,12,0,Math.PI*2,0,Math.PI/2),goldMat); bell.position.set(1.6,1.27,0.2); g.add(bell);
    g.position.set(-7.5,0,-6.5); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(-7.5,-6.5,5.4,1.6); addCollider(-10.6,-5.1,1.6,3.2);
    var rec=person({skin:0xe3b48f,cloth:0x7a2230,cloth2:0x2a2027,hair:0x241a12});
    rec.group.position.set(-9.2,0,-6.6); rec.group.rotation.y=Math.PI/2; world.add(rec.group);
    rec.kind='idle'; ANIM.push(rec);
    tagObject(base,{ name:{en:'Reception & front desk',es:'Recepción'},
      desc:{en:'The walnut front desk with a brass kick-plate, a service bell and a "RECEPCIÓN" sign. A receptionist stands behind it to check guests in — the first human point of the hotel.',
        es:'El mostrador de nogal con zócalo de latón, un timbre de servicio y el letrero "RECEPCIÓN". Una recepcionista atiende tras él para registrar a los huéspedes — el primer punto humano del hotel.'},
      note:{en:'The receptionist is a procedural character with idle motion.',es:'La recepcionista es un personaje procedural con movimiento de reposo.'} });
  })();

  /* ---------------- BAR + WAITER + STOOLS + BOTTLES ---------------- */
  (function(){
    var g=new THREE.Group();
    var counter=box(5.4,1.15,1.2,woodDarkMat); counter.position.set(0,0.57,0); g.add(counter);
    var ctop=box(5.8,0.1,1.5,mat(0x241a14,.25,.2)); ctop.position.set(0,1.18,0); g.add(ctop);
    var rail=box(5.6,0.06,0.06,goldMat); rail.position.set(0,1.05,0.62); g.add(rail);
    // back shelf with bottles
    var shelf=box(5.6,2.4,0.3,woodDarkMat); shelf.position.set(0,1.6,-1.3); g.add(shelf);
    for(var s=0;s<3;s++) { var sh=box(5.2,0.08,0.5,mat(0x3a2a1e,.5)); sh.position.set(0,0.9+s*0.6,-1.15); g.add(sh); }
    var bcol=[0x6fae6f,0xc25a33,0xd8a23a,0x4f8fa6,0x9a3b5a,0x3f7a3c];
    for(var b=0;b<14;b++){ var bot=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.34,10), mat(bcol[b%6],.2,.1)); bot.position.set(-2.4+b*0.36,1.1+(b%3)*0.6,-1.15); g.add(bot); }
    // stools
    for(var st=-2;st<=2;st++){ var seat=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.26,0.1,16),goldMat); seat.position.set(st*1.0,0.95,0.95); g.add(seat);
      var leg=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.85,8),mat(PAL.dark,.4,.4)); leg.position.set(st*1.0,0.45,0.95); g.add(leg); addCollider(st*1.0+8,0.95-6.6,0.5,0.5); }
    g.position.set(8,0,-6.6); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(8,-6.6,5.8,1.5); addCollider(8,-7.9,5.6,0.3);
    // waiter behind the bar with a tray
    var w=person({skin:0xcf9f76,cloth:0x20242a,cloth2:0x16181c,hair:0x18120c, vest:true});
    w.group.position.set(8,0,-7.6); world.add(w.group); w.kind='waiter'; ANIM.push(w);
    tagObject(counter,{ name:{en:'Lobby bar',es:'Bar del vestíbulo'},
      desc:{en:'A walnut bar with a brass foot-rail, stools and a back-lit shelf of bottles. A waiter works behind it, serving on a tray — the social heart of the lobby.',
        es:'Un bar de nogal con reposapiés de latón, banquillos y una estantería de botellas. Un mesero trabaja detrás, sirviendo en una charola — el corazón social del vestíbulo.'},
      note:{en:'The waiter is animated, balancing a tray of drinks.',es:'El mesero está animado, balanceando una charola de bebidas.'} });
  })();

  /* ---------------- LOUNGE + CHANDELIER + PLANTS ---------------- */
  function sofa(x,z,rot){ var g=new THREE.Group();
    var seat=box(2.4,0.4,0.95,terraMat); seat.position.y=0.42; g.add(seat);
    var back=box(2.4,0.7,0.25,terraMat); back.position.set(0,0.75,-0.35); g.add(back);
    var a1=box(0.25,0.55,0.95,terraMat); a1.position.set(-1.07,0.55,0); g.add(a1);
    var a2=a1.clone(); a2.position.x=1.07; g.add(a2);
    g.position.set(x,0,z); g.rotation.y=rot||0; g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(x,z, rot?0.95:2.4, rot?2.4:0.95); return seat; }
  var lsofa=sofa(0,-2.0,0); sofa(-2.6,-3.4,Math.PI/2); sofa(2.6,-3.4,-Math.PI/2);
  var ctable=box(1.4,0.4,1.4,woodDarkMat); ctable.position.set(0,0.2,-3.4); ctable.castShadow=true; world.add(ctable); addCollider(0,-3.4,1.4,1.4);
  tagObject(lsofa,{ name:{en:'Lobby lounge',es:'Sala de estar'},
    desc:{en:'A terracotta lounge set around a walnut coffee table, under the chandelier — where guests wait and talk. The deep red recalls colonial Guanajuato interiors.',
      es:'Un juego de sala en terracota alrededor de una mesa de nogal, bajo el candil — donde los huéspedes esperan y conversan. El rojo profundo evoca los interiores coloniales de Guanajuato.'}, note:{en:'',es:''} });
  function plant(x,z){ var g=new THREE.Group(); var pot=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.22,0.5,16),terraMat); pot.position.y=0.25; g.add(pot);
    for(var i=0;i<6;i++){ var l=new THREE.Mesh(new THREE.ConeGeometry(0.18,1.0,8),mat(0x3f6b3a,.8)); l.position.set((Math.random()-.5)*0.3,0.9+Math.random()*0.3,(Math.random()-.5)*0.3); l.rotation.z=(Math.random()-.5)*0.6; g.add(l);}
    g.position.set(x,0,z); g.traverse(function(o){o.castShadow=true;}); world.add(g); addCollider(x,z,0.6,0.6); }
  plant(-11,-0.8); plant(11,-0.8); plant(-0.0,-7.6);

  // chandelier (double-height lobby)
  (function(){
    var g=new THREE.Group(); var rod=box(0.06,1.4,0.06,goldMat); rod.position.y=H2-0.8; g.add(rod);
    var ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,0.07,10,28),goldMat); ring.rotation.x=Math.PI/2; ring.position.y=H2-1.6; g.add(ring);
    var light=new THREE.PointLight(0xffd9a0,1.0,30,1.6); light.position.set(0,H2-1.8,-3.5); g.add(light);
    var core=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,16),new THREE.MeshStandardMaterial({color:0xfff2d6,emissive:0xffd98a,emissiveIntensity:1.3})); core.position.y=H2-1.7; g.add(core);
    for(var a=0;a<10;a++){ var an=a/10*Math.PI*2; var bb=new THREE.Mesh(new THREE.SphereGeometry(0.1,12,12),new THREE.MeshStandardMaterial({color:0xfff2d6,emissive:0xffce7a,emissiveIntensity:1.1})); bb.position.set(Math.cos(an)*1.1,H2-1.75,Math.sin(an)*1.1); g.add(bb);}
    g.position.set(0,0,-3.5); world.add(g);
    tagObject(core,{ name:{en:'Grand chandelier',es:'Candil principal'},
      desc:{en:'A brass-ring chandelier with ten warm bulbs hanging in the double-height lobby, pouring golden light down onto the marble below.',
        es:'Un candil de aro de latón con diez focos cálidos colgando en el vestíbulo de doble altura, derramando luz dorada sobre el mármol.'},
      note:{en:'A real PointLight — the glow is its actual illumination.',es:'Una PointLight real — el resplandor es su iluminación real.'} });
  })();

  /* ---------------- ELEVATOR ---------------- */
  (function(){
    var frame=box(2.4,3.0,0.3,mat(PAL.sandDark,.8)); frame.position.set(11.3,1.5,-9.0); frame.rotation.y=Math.PI/2; world.add(frame);
    var dL=box(0.9,2.6,0.1,goldMat); dL.position.set(11.15,1.3,-9.4); dL.rotation.y=Math.PI/2; world.add(dL);
    var dR=box(0.9,2.6,0.1,goldMat); dR.position.set(11.15,1.3,-8.6); dR.rotation.y=Math.PI/2; world.add(dR);
    addCollider(11.3,-9.0,0.3,2.4);
    tagObject(frame,{ name:{en:'Elevator',es:'Elevador'},
      desc:{en:'Polished brass elevator doors in a stone frame, beside the bar — the alternative to the staircase for reaching the upper floor.',
        es:'Puertas de elevador en latón pulido en un marco de cantera, junto al bar — la alternativa a la escalera para llegar al piso superior.'}, note:{en:'',es:''} });
  })();

  /* ---------------- GUEST ROOMS (bed + nightstand + lamp + window) ---------------- */
  function guestRoom(cx,cz,baseY,label){
    var g=new THREE.Group();
    var bedZ=cz-2.0;
    var fr=box(2.4,0.5,3.0,woodMat); fr.position.set(cx,baseY+0.3,bedZ); g.add(fr);
    var mt=box(2.2,0.35,2.8,mat(0xf2ead9,.9)); mt.position.set(cx,baseY+0.62,bedZ); g.add(mt);
    var hd=box(2.4,1.1,0.2,woodDarkMat); hd.position.set(cx,baseY+0.85,bedZ-1.5); g.add(hd);
    var pil1=box(0.9,0.2,0.5,mat(0xffffff,.8)); pil1.position.set(cx-0.5,baseY+0.85,bedZ-1.1); g.add(pil1);
    var pil2=pil1.clone(); pil2.position.x=cx+0.5; g.add(pil2);
    var run=box(2.2,0.06,1.0,terraMat); run.position.set(cx,baseY+0.81,bedZ+0.7); g.add(run);
    var ns=box(0.6,0.6,0.6,woodDarkMat); ns.position.set(cx-1.7,baseY+0.3,bedZ-1.2); g.add(ns);
    var shade=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,0.32,16),new THREE.MeshStandardMaterial({color:0xfff0d0,emissive:0xffce85,emissiveIntensity:.85})); shade.position.set(cx-1.7,baseY+0.95,bedZ-1.2); g.add(shade);
    var lampBase=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.12,0.4,12),goldMat); lampBase.position.set(cx-1.7,baseY+0.65,bedZ-1.2); g.add(lampBase);
    var ll=new THREE.PointLight(0xffcaa0,0.5,7,2); ll.position.set(cx-1.7,baseY+1.0,bedZ-1.2); g.add(ll);
    g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(cx,bedZ,2.4,3.0); addCollider(cx-1.7,bedZ-1.2,0.6,0.6);
    // window on the back outer wall
    var wf=box(2.2,1.8,0.16,woodDarkMat); wf.position.set(cx,baseY+2.0,-19.85); world.add(wf);
    var wg=box(1.9,1.5,0.1,new THREE.MeshStandardMaterial({color:0xbcd6e6,roughness:.05,metalness:.1,emissive:0x88aac0,emissiveIntensity:.3})); wg.position.set(cx,baseY+2.0,-19.76); world.add(wg);
    return { bed:fr, lamp:shade, win:wf };
  }
  var gW=guestRoom(-6,-15.0,0,'G1'); var gE=guestRoom(6,-15.0,0,'G2');
  var uW=guestRoom(-6,-15.0,FH,'U1'); var uE=guestRoom(6,-15.0,FH,'U2');
  tagObject(gE.bed,{ name:{en:'Ground-floor suite',es:'Suite de planta baja'},
    desc:{en:'One of two ground-floor guest rooms behind the lobby: a king bed with walnut frame, white linens, a terracotta runner, a nightstand and a glowing lamp.',
      es:'Una de las dos habitaciones de planta baja tras el vestíbulo: cama king con base de nogal, ropa blanca, pie de cama en terracota, buró y una lámpara encendida.'}, note:{en:'',es:''} });
  tagObject(uE.bed,{ name:{en:'Upper-floor suite',es:'Suite del piso superior'},
    desc:{en:'An upstairs guest room reached by the staircase. Same warm furnishings, with a window onto the morning sky — the lit windows you saw on the facade.',
      es:'Una habitación del piso de arriba a la que se llega por la escalera. El mismo mobiliario cálido, con una ventana al cielo de la mañana — las ventanas encendidas que viste en la fachada.'}, note:{en:'',es:''} });
  tagObject(uE.win,{ name:{en:'Guest-room window',es:'Ventana de la habitación'},
    desc:{en:'A window framing the sky beyond the upper suite; daylight spills across the floor and balances the warm bedside lamp.',
      es:'Una ventana que enmarca el cielo más allá de la suite superior; la luz del día entra y equilibra la lámpara cálida del buró.'}, note:{en:'',es:''} });

  // a couple of standing guests for life
  (function(){ var gu=person({skin:0xd9a679,cloth:0x3a5a78,cloth2:0x222,hair:0x3a2a18}); gu.group.position.set(-1.6,0,-1.2); gu.group.rotation.y=-0.6; world.add(gu.group); gu.kind='idle'; ANIM.push(gu);
    var gu2=person({skin:0xc99a72,cloth:0x556b3a,cloth2:0x2a2418,hair:0x14100a}); gu2.group.position.set(2.4,0,-4.8); gu2.group.rotation.y=2.4; world.add(gu2.group); gu2.kind='idle'; ANIM.push(gu2); })();

  // walking NPCs — a bellhop crossing the lobby and a guest strolling the west side
  (function(){
    var bell=person({skin:0xcf9f76,cloth:0x7a1f2c,cloth2:0x161616,hair:0x1a130c,vest:true});
    world.add(bell.group); bell.kind='walker'; bell.speed=1.5; bell.off=0;
    bell.path=makePath([[-8.5,-1.2],[8.5,-1.2]]); ANIM.push(bell);
    var stroll=person({skin:0xe0b48d,cloth:0x2f5a52,cloth2:0x20201c,hair:0x2a1d12});
    world.add(stroll.group); stroll.kind='walker'; stroll.speed=1.15; stroll.off=4.0;
    stroll.path=makePath([[-9,-1.4],[-9,-4.6],[-4.5,-4.6],[-4.5,-1.4]]); ANIM.push(stroll);
  })();

  /* ---------------- EXTERIOR: fountain, pool, palms ---------------- */
  (function(){
    var g=new THREE.Group();
    var basin=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.9,0.6,28),mat(PAL.sandDark,.9)); basin.position.y=0.3; g.add(basin);
    var water=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.55,0.1,28),new THREE.MeshStandardMaterial({color:0x4f8fa6,roughness:.08,metalness:.3,transparent:true,opacity:.85,envMapIntensity:1.3})); water.position.y=0.58; g.add(water);
    var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.28,1.1,16),mat(PAL.sandDark,.9)); stem.position.y=1.0; g.add(stem);
    var bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.2,0.3,18),mat(PAL.sandDark,.9)); bowl.position.y=1.6; g.add(bowl);
    g.position.set(0,0,9); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g); addCollider(0,9,3.8,3.8);
    tagObject(basin,{ name:{en:'Plaza fountain',es:'Fuente de la plaza'},
      desc:{en:'A two-tier stone fountain on the entrance plaza — the welcoming courtyard found in front of colonial Mexican posadas.',
        es:'Una fuente de cantera de dos niveles en la plaza de entrada — el patio de bienvenida frente a las posadas coloniales mexicanas.'}, note:{en:'',es:''} });
  })();
  (function(){
    var deck=new THREE.Mesh(new THREE.PlaneGeometry(13,9),new THREE.MeshStandardMaterial({color:0xd8c6a4,roughness:.9})); deck.rotation.x=-Math.PI/2; deck.position.set(20,0.03,4); deck.receiveShadow=true; world.add(deck); FLOORS.push(deck);
    var coping=box(9.2,0.3,6.2,mat(PAL.sandDark,.85)); coping.position.set(20,0.15,4); world.add(coping);
    var pool=box(8.4,0.4,5.4,new THREE.MeshStandardMaterial({color:0x2f97b8,roughness:.05,metalness:.3,transparent:true,opacity:.86,envMapIntensity:1.4})); pool.position.set(20,0.22,4); world.add(pool);
    // loungers + umbrella
    for(var i=-1;i<=1;i+=2){ var ch=box(0.7,0.12,1.8,mat(0xeee3d0,.7)); ch.position.set(24.5,0.5,4+i*1.6); ch.castShadow=true; world.add(ch);
      var bk=box(0.7,0.9,0.12,mat(0xeee3d0,.7)); bk.position.set(24.85,0.85,4+i*1.6); bk.rotation.x=-0.5; world.add(bk); }
    var um=new THREE.Mesh(new THREE.ConeGeometry(1.6,0.7,12),terraMat); um.position.set(24.6,2.4,4); world.add(um);
    var ump=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.4,8),mat(PAL.dark,.5)); ump.position.set(24.6,1.2,4); world.add(ump);
    tagObject(pool,{ name:{en:'Swimming pool',es:'Alberca'},
      desc:{en:'An outdoor pool with sandstone coping, loungers and a terracotta parasol on the sun deck beside the hotel. The glossy water reflects the sky.',
        es:'Una alberca al aire libre con borde de cantera, camastros y una sombrilla de terracota en la cubierta junto al hotel. El agua brillante refleja el cielo.'}, note:{en:'Reached through the front entrance — the tour walks out and around, never through a wall.',es:'Se llega por la entrada principal — el tour sale y rodea, nunca atraviesa una pared.'} });
    function palm(x,z){ var pg=new THREE.Group(); var t=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.26,3.4,10),woodMat); t.position.y=1.7; pg.add(t);
      for(var i=0;i<7;i++){ var an=i/7*Math.PI*2; var fr=new THREE.Mesh(new THREE.ConeGeometry(0.3,2.0,6),mat(0x3f7a3c,.8)); fr.position.set(Math.cos(an)*0.7,3.5,Math.sin(an)*0.7); fr.rotation.z=Math.cos(an)*0.9; fr.rotation.x=Math.sin(an)*0.9; pg.add(fr);}
      pg.position.set(x,0,z); pg.traverse(function(o){o.castShadow=true;}); world.add(pg); addCollider(x,z,0.5,0.5); }
    palm(-8,8); palm(8,8); palm(15,9); palm(26,7);
  })();

  /* extra warm interior point lights */
  [[-7,-15],[6,-15],[-7,-15+0],[0,-10]].forEach(function(p){ var L=new THREE.PointLight(0xffe0b0,0.35,14,2); L.position.set(p[0],3.0,p[1]); scene.add(L); });
  var upL1=new THREE.PointLight(0xffe0b0,0.4,16,2); upL1.position.set(-6,FH+2.6,-15); scene.add(upL1);
  var upL2=new THREE.PointLight(0xffe0b0,0.4,16,2); upL2.position.set(6,FH+2.6,-15); scene.add(upL2);

  /* ============================================================
     CHARACTER FACTORY (procedural low-poly humanoid)
     ============================================================ */
  function person(o){ o=o||{};
    var g=new THREE.Group();
    var skin=mat(o.skin||0xd9a679,.62), cloth=mat(o.cloth||0x33363c,.66,.02),
        cloth2=mat(o.cloth2||0x222,.7), hair=mat(o.hair||0x241a12,.8), shoe=mat(0x140f0b,.5,.12);
    function lm(r1,r2,len,m){ var me=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,len,14),m); me.castShadow=true; return me; }
    // legs — pivot at the hip so they can swing while walking
    function leg(side){ var grp=new THREE.Group(); grp.position.set(side*0.13,0.96,0);
      var th=lm(0.10,0.085,0.5,cloth2); th.position.y=-0.25; grp.add(th);
      var sh=lm(0.075,0.055,0.46,cloth2); sh.position.y=-0.71; grp.add(sh);
      var ft=box(0.13,0.1,0.3,shoe); ft.position.set(0,-0.95,0.07); grp.add(ft);
      g.add(grp); return grp; }
    var legLG=leg(-1), legRG=leg(1);
    // pelvis + tapered chest
    var pelvis=lm(0.21,0.2,0.3,cloth); pelvis.position.y=1.1; g.add(pelvis);
    var torso=lm(0.23,0.19,0.58,cloth); torso.position.y=1.5; g.add(torso);
    if(o.vest){ var vest=lm(0.245,0.205,0.5,mat(0x111316,.55)); vest.position.y=1.5; g.add(vest);
      var apron=box(0.34,0.46,0.04,mat(0xf2ead9,.85)); apron.position.set(0,1.24,0.205); apron.castShadow=true; g.add(apron); }
    // shoulders
    var sh2=lm(0.085,0.085,0.5,cloth); sh2.rotation.z=Math.PI/2; sh2.position.y=1.74; g.add(sh2);
    // arms — pivot at shoulder
    function arm(side){ var grp=new THREE.Group(); grp.position.set(side*0.27,1.72,0);
      var up=lm(0.072,0.06,0.42,cloth); up.position.y=-0.21; grp.add(up);
      var fore=lm(0.057,0.05,0.4,skin); fore.position.y=-0.6; grp.add(fore);
      var hand=new THREE.Mesh(new THREE.SphereGeometry(0.058,10,10),skin); hand.position.y=-0.82; grp.add(hand);
      g.add(grp); return grp; }
    var armLG=arm(-1), armRG=arm(1);
    // neck + head + face
    var neck=lm(0.06,0.07,0.12,skin); neck.position.y=1.82; g.add(neck);
    var headG=new THREE.Group(); headG.position.set(0,1.95,0);
    var head=new THREE.Mesh(new THREE.SphereGeometry(0.15,20,20),skin); head.scale.set(0.96,1.1,1); headG.add(head);
    var hairM=new THREE.Mesh(new THREE.SphereGeometry(0.158,20,18,0,Math.PI*2,0,Math.PI*0.68),hair); hairM.position.y=0.025; hairM.scale.set(1.02,1,1.02); headG.add(hairM);
    var eyeM=mat(0x140f0a,.3);
    [-0.055,0.055].forEach(function(ex){ var e=new THREE.Mesh(new THREE.SphereGeometry(0.02,8,8),eyeM); e.position.set(ex,0.0,0.138); e.scale.set(1,1.3,0.6); headG.add(e); });
    g.add(headG);
    if(o.waiter || o.vest){ // tray balanced in right hand
      var tray=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.03,18),goldMat); tray.position.set(0,-0.8,0.16); armRG.add(tray);
      for(var c=0;c<3;c++){ var cup=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.035,0.11,10),mat([0xc25a33,0xd8a23a,0x6fae6f][c],.3)); cup.position.set(-0.1+c*0.1,-0.73,0.16); armRG.add(cup); }
      armRG.rotation.x=-1.25;  // forearm up holding tray
    }
    g.traverse(function(ob){ if(ob.isMesh) ob.castShadow=true; });
    return { group:g, armL:armLG, armR:armRG, legL:legLG, legR:legRG, head:headG, torso:torso };
  }

  // path helper for walking NPCs — total length + position/heading at a distance
  function makePath(pts){ var seg=[], tot=0; for(var i=0;i<pts.length;i++){ var a=pts[i], b=pts[(i+1)%pts.length];
      var dx=b[0]-a[0], dz=b[1]-a[1], L=Math.hypot(dx,dz); seg.push({a:a,b:b,L:L,h:Math.atan2(dx,dz)}); tot+=L; }
    return {seg:seg,tot:tot}; }
  function pathAt(path,d){ d=((d%path.tot)+path.tot)%path.tot; for(var i=0;i<path.seg.length;i++){ var s=path.seg[i];
      if(d<=s.L){ var k=s.L?d/s.L:0; return {x:s.a[0]+(s.b[0]-s.a[0])*k, z:s.a[1]+(s.b[1]-s.a[1])*k, h:s.h}; } d-=s.L; }
    var f=path.seg[0]; return {x:f.a[0],z:f.a[1],h:f.h}; }

  function animPeople(t){
    ANIM.forEach(function(p,i){
      var ph=i*1.3;
      if(p.kind==='walker'){
        var d=t*p.speed + p.off, pos=pathAt(p.path,d);
        p.group.position.x=pos.x; p.group.position.z=pos.z;
        // smooth turn toward heading
        var cur=p.group.rotation.y, want=pos.h, diff=Math.atan2(Math.sin(want-cur),Math.cos(want-cur));
        p.group.rotation.y=cur+diff*0.12;
        var stride=t*p.speed*3.2;
        p.legL.rotation.x=Math.sin(stride)*0.55; p.legR.rotation.x=-Math.sin(stride)*0.55;
        p.armL.rotation.x=-Math.sin(stride)*0.45; p.armR.rotation.x=Math.sin(stride)*0.45;
        p.group.position.y=Math.abs(Math.sin(stride))*0.04;            // gentle bob
        p.torso.rotation.z=Math.sin(stride)*0.03;
        if(p.head) p.head.rotation.y=Math.sin(t*0.4+ph)*0.25;
      } else if(p.kind==='waiter'){
        p.group.position.y = Math.sin(t*1.4+ph)*0.012;
        p.armL.rotation.x = Math.sin(t*1.0+ph)*0.16 - 0.1;
        p.head.rotation.y = Math.sin(t*0.5+ph)*0.45;
        p.torso.rotation.y = Math.sin(t*0.6+ph)*0.05;
        p.legL.rotation.x = Math.sin(t*0.9+ph)*0.04; p.legR.rotation.x=-Math.sin(t*0.9+ph)*0.04;
      } else { // idle — breathing, weight shift, occasional gesture & look
        p.torso.rotation.z = Math.sin(t*0.8+ph)*0.025;
        p.group.position.y = Math.sin(t*1.1+ph)*0.01;                  // breathing
        p.armL.rotation.x = Math.sin(t*0.7+ph)*0.12;
        p.armR.rotation.x = Math.sin(t*0.7+ph+1)*0.12;
        p.legL.rotation.x = Math.sin(t*0.4+ph)*0.03; p.legR.rotation.x=-Math.sin(t*0.4+ph)*0.03;
        p.head.rotation.y = Math.sin(t*0.3+ph)*0.5;
        p.head.rotation.x = Math.sin(t*0.5+ph)*0.08;
      }
    });
  }

  /* ============================================================
     PLAYER CONTROLS (with floor raycast for stairs / 2 floors)
     ============================================================ */
  var R=0.30, EYE=1.6;                       // slimmer collider → roomier walking
  var player=new THREE.Vector3(0,EYE,16);
  var yaw=0, pitch=0;
  var keys={}; var locked=false, autoMode=false; var bobT=0;
  var vy=0, grounded=true;                    // vertical velocity + ground flag (jump)
  var GRAV=16.0, JUMP=5.6, STEP_UP=0.55;      // gravity, jump impulse, max auto-step height
  var downRay=new THREE.Raycaster(); var DOWN=new THREE.Vector3(0,-1,0);

  function collides(x,z){ for(var i=0;i<WALLS.length;i++){ var w=WALLS[i]; if(x>w.x1-R&&x<w.x2+R&&z>w.z1-R&&z<w.z2+R) return true; } return false; }
  function floorYAt(x,z,fromY){ downRay.set(new THREE.Vector3(x,fromY+1.6,z),DOWN); downRay.far=fromY+6;
    var hits=downRay.intersectObjects(FLOORS,false); if(hits.length) return hits[0].point.y; return 0; }

  function requestLock(){ if(!autoMode) canvas.requestPointerLock(); }
  document.addEventListener('pointerlockchange', function(){ locked=(document.pointerLockElement===canvas);
    document.body.classList.toggle('is-locked',locked);
    document.getElementById('crosshair').style.display=(locked||autoMode)?'grid':'none'; });
  document.addEventListener('mousemove', function(e){ if(!locked||autoMode) return;
    yaw-=e.movementX*0.0022; pitch-=e.movementY*0.0022; pitch=Math.max(-1.4,Math.min(1.4,pitch)); });
  var MOVE={KeyW:1,KeyA:1,KeyS:1,KeyD:1,ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1};
  window.addEventListener('keydown', function(e){ keys[e.code]=true;
    if(e.code==='Space'){ e.preventDefault(); }                 // don't scroll the page
    if(autoMode && (MOVE_INTERRUPT(e.code)||e.code==='Space')){ stopAuto(); requestLock(); return; }
    if(e.code==='KeyE') tryInspect();
    if(e.code==='Escape') closeInspect();
  });
  function MOVE_INTERRUPT(code){ return MOVE[code]===1; }
  window.addEventListener('keyup', function(e){ keys[e.code]=false; });
  canvas.addEventListener('click', function(){ if(autoMode){ stopAuto(); requestLock(); return; }
    if(!locked) requestLock(); else tryInspect(); });

  /* ---------------- inspection ---------------- */
  var ray=new THREE.Raycaster(); ray.far=6; var center=new THREE.Vector2(0,0); var hovered=null;
  var promptEl=document.getElementById('prompt'), promptText=document.getElementById('promptText'), crossEl=document.getElementById('crosshair');
  var insEl=document.getElementById('inspect');
  function updateHover(){ if(autoMode) return;
    ray.setFromCamera(center,camera); var hits=ray.intersectObjects(INTERACTABLES,true);
    var found=null; if(hits.length){ var o=hits[0].object; found=o.userData.root||o; }
    hovered=found;
    if(found && insEl.hidden){ promptText.textContent=tr('inspect'); promptEl.hidden=false; crossEl.classList.add('is-hot'); }
    else { promptEl.hidden=true; crossEl.classList.remove('is-hot'); }
  }
  function tryInspect(){ if(hovered && hovered.userData.info) openInspect(hovered.userData.info); }
  function openInspect(info){ document.getElementById('inspectTag').textContent=tr('component');
    document.getElementById('inspectTitle').textContent=info.name[LANG]||info.name.en;
    document.getElementById('inspectDesc').textContent=info.desc[LANG]||info.desc.en;
    document.getElementById('inspectNote').textContent=(info.note&&(info.note[LANG]||info.note.en))||'';
    insEl.hidden=false; }
  function closeInspect(){ insEl.hidden=true; }
  document.getElementById('inspectClose').addEventListener('click', closeInspect);

  /* ============================================================
     AUTO TOUR — door-by-door path (never through a wall)
     y is explicit so the camera climbs the stairs smoothly.
     ============================================================ */
  var Y0=EYE, Y1=EYE+FH;   // eye heights on each floor
  var WP=[
    {p:[0,Y0,16],   look:[0,1,9],     d:1.4},
    {p:[3.5,Y0,11], look:[0,0.9,9],   d:2.8, info:'Plaza fountain'},
    {p:[0,Y0,6],    look:[0,4.2,0.2], d:2.2, info:'Hotel facade & sign'},
    {p:[0,Y0,1.5],  look:[-7,1.2,-6], d:1.0},                              // enter front door
    {p:[-4,Y0,-3],  look:[-8.5,1.2,-6.5], d:3.0, info:'Reception & front desk'},
    {p:[3.5,Y0,-3], look:[8,1.3,-6.6], d:3.0, info:'Lobby bar'},
    {p:[0,Y0,-2],   look:[0,0.6,-3.6], d:2.2, info:'Lobby lounge'},
    {p:[0,Y0,-3.6], look:[0,H2-1.7,-3.5], d:2.4, info:'Grand chandelier'},
    {p:[8.5,Y0,-4], look:[11.3,1.4,-9], d:2.2, info:'Elevator'},
    {p:[0,Y0,-4.6], look:[0,2.5,-9],  d:1.6, info:'Grand staircase'},      // foot of stairs
    {p:[0,Y0+1.4,-6.6], look:[0,Y0+1.6,-9.5], d:0.9},                      // climbing
    {p:[0,Y0+2.8,-7.9], look:[0,Y1,-10.5], d:0.9},                         // climbing
    {p:[0,Y1,-9.3],  look:[0,Y1-0.4,-12.5], d:1.6},                        // reach mezzanine
    {p:[0,Y1,-10.2], look:[0,2.2,-3],  d:2.2},                             // look down over railing
    {p:[6,Y1,-11.6], look:[6,Y1-0.6,-15], d:1.2},                          // into upper east room (door x[5.4,7.4])
    {p:[5.2,Y1,-13.8],look:[6,Y1-0.8,-17], d:3.0, info:'Upper-floor suite'},
    {p:[5.2,Y1,-15.5],look:[6,Y1,-19.8], d:2.6, info:'Guest-room window'},
    {p:[6,Y1,-11.6], look:[0,Y1-0.4,-10], d:1.2},                         // back to landing
    {p:[0,Y1,-9.6],  look:[0,Y0+2.6,-7], d:1.0},                          // top of stairs
    {p:[0,Y0+2.8,-7.9], look:[0,Y0+1,-6], d:0.9},                          // descend
    {p:[0,Y0+1.4,-6.6], look:[6,Y0+1,-9], d:0.9},
    {p:[0,Y0,-5],    look:[6,Y0,-9.5], d:1.4},
    {p:[6,Y0,-9.6],  look:[6,0.8,-14], d:1.2},                            // into ground east room (door x[5,7])
    {p:[6,Y0,-12.5], look:[6,0.85,-15.5], d:3.0, info:'Ground-floor suite'},
    {p:[6,Y0,-9.6],  look:[0,Y0,-3], d:1.0},                              // back to lobby
    {p:[0,Y0,-1.5],  look:[0,2,6], d:1.0},                                // face entrance
    {p:[0,Y0,6],     look:[14,1,5], d:1.2},                               // out the front door
    {p:[13,Y0,6],    look:[19,0.5,4], d:1.4},                             // round to pool (outside)
    {p:[14,Y0,5.2],  look:[20,0.4,4], d:3.0, info:'Swimming pool'},
    {p:[9,Y0,13],    look:[0,3,0], d:2.0}                                 // pull back, loop
  ];
  WP.forEach(function(w){ if(w.info){ for(var i=0;i<INTERACTABLES.length;i++){ var inf=INTERACTABLES[i].userData.info; if(inf&&inf.name.en===w.info){ w.infoObj=inf; break; } } } });

  var aIdx=0, aPhase='move', aT=0, aTimer=0, panelShown=false;
  var aStart=new THREE.Vector3(); var dummy=new THREE.Object3D();
  var desired=new THREE.Vector3(), subj=new THREE.Vector3(), aheadV=new THREE.Vector3();
  var FWD=new THREE.Vector3(), DIR=new THREE.Vector3(), dwellEl=0;
  var DRIFT=new THREE.Quaternion(), EU=new THREE.Euler();
  function easeIO(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2; }
  // set manual yaw/pitch so the camera looks from `pos` toward `tx,ty,tz`
  // (explicit formula — avoids the 180° flip of quaternion->euler decomposition)
  function aimAt(pos, tx, ty, tz){ DIR.set(tx-pos.x, ty-pos.y, tz-pos.z).normalize();
    pitch=Math.asin(Math.max(-1,Math.min(1,DIR.y))); yaw=Math.atan2(-DIR.x,-DIR.z); }
  function resolveAuto(p){ for(var i=0;i<WALLS.length;i++){ var w=WALLS[i];
    if(p.x>w.x1-R&&p.x<w.x2+R&&p.z>w.z1-R&&p.z<w.z2+R){ var dl=p.x-(w.x1-R),drr=(w.x2+R)-p.x,dtt=p.z-(w.z1-R),dbb=(w.z2+R)-p.z; var m=Math.min(dl,drr,dtt,dbb);
      if(m===dl)p.x=w.x1-R; else if(m===drr)p.x=w.x2+R; else if(m===dtt)p.z=w.z1-R; else p.z=w.z2+R; } } }

  function startAuto(){ autoMode=true; if(document.pointerLockElement) document.exitPointerLock();
    promptEl.hidden=true; crossEl.classList.remove('is-hot');
    aIdx=0; aPhase='move'; aT=0; panelShown=false; aStart.copy(player);
    document.getElementById('crosshair').style.display='grid';
    document.getElementById('autoBtn').classList.add('is-on');
    document.getElementById('autoLbl').textContent=tr('autoStop');
    document.getElementById('startAutoLbl').textContent=tr('autoStop'); hideHintSoon(); }
  function stopAuto(){ autoMode=false; closeInspect();
    document.getElementById('autoBtn').classList.remove('is-on');
    document.getElementById('autoLbl').textContent=tr('auto');
    document.getElementById('startAutoLbl').textContent=tr('watch');
    camera.getWorldDirection(FWD); pitch=Math.asin(Math.max(-1,Math.min(1,FWD.y))); yaw=Math.atan2(-FWD.x,-FWD.z); }

  function updateAuto(dt,time){
    var w=WP[aIdx]; var tp=w.p;
    // ALWAYS aim at this waypoint's subject — the camera turns toward it WHILE it
    // walks, so it is already framed on arrival (it never presents before focusing).
    subj.set(w.look[0],w.look[1],w.look[2]); desired.copy(subj);
    if(aPhase==='move'){
      var seg=Math.max(1.0, aStart.distanceTo(aheadV.set(tp[0],tp[1],tp[2]))/2.2);
      aT+=dt/seg; var k=easeIO(Math.min(aT,1));
      player.set(aStart.x+(tp[0]-aStart.x)*k, aStart.y+(tp[1]-aStart.y)*k, aStart.z+(tp[2]-aStart.z)*k);
      if(aT>=1){ aPhase='dwell'; aTimer=w.d; panelShown=false; dwellEl=0; }
    } else {
      aTimer-=dt; dwellEl+=dt;
      if(aTimer<=0){ aPhase='move'; aT=0; aStart.copy(player); aIdx=(aIdx+1)%WP.length; closeInspect(); }
    }
    resolveAuto(player);
    var bob=Math.sin(time*4.4)*0.022;
    camera.position.set(player.x,player.y+bob,player.z);
    dummy.position.copy(camera.position); dummy.lookAt(desired.x,desired.y,desired.z);
    var dyaw=Math.sin(time*0.5)*0.03+Math.sin(time*0.17)*0.015, dpitch=Math.sin(time*0.72)*0.015;
    DRIFT.setFromEuler(EU.set(dpitch,dyaw,0,'YXZ')); dummy.quaternion.multiply(DRIFT);
    camera.quaternion.slerp(dummy.quaternion, Math.min(1, dt*5));
    // open the description ONLY once the camera is truly pointing at the subject
    if(aPhase==='dwell' && !panelShown && dwellEl>0.15){
      camera.getWorldDirection(FWD); DIR.copy(subj).sub(camera.position).normalize();
      if(FWD.dot(DIR) > 0.97){ if(w.infoObj) openInspect(w.infoObj); panelShown=true; }
    }
  }

  /* ---------------- manual update ---------------- */
  function updateManual(dt){
    var speed=(keys['ShiftLeft']||keys['ShiftRight'])?6.6:3.8;
    var fwd=0,str=0;
    if(keys['KeyW']||keys['ArrowUp'])fwd+=1; if(keys['KeyS']||keys['ArrowDown'])fwd-=1;
    if(keys['KeyD']||keys['ArrowRight'])str+=1; if(keys['KeyA']||keys['ArrowLeft'])str-=1;
    var sin=Math.sin(yaw),cos=Math.cos(yaw);
    var dx=(-sin*fwd+cos*str), dz=(-cos*fwd-sin*str); var len=Math.hypot(dx,dz)||1; dx/=len; dz/=len;
    var moving=(fwd||str);
    if(moving){ var step=speed*dt; var nx=player.x+dx*step, nz=player.z+dz*step;
      if(!collides(nx,player.z)) player.x=nx; if(!collides(player.x,nz)) player.z=nz; bobT+=dt*(speed*1.7); }
    player.x=Math.max(-60,Math.min(60,player.x)); player.z=Math.max(-60,Math.min(60,player.z));

    // --- vertical: gravity + jump + walk-up stairs ---
    var groundY=floorYAt(player.x,player.z,player.y-EYE)+EYE;   // eye height standing on the floor here
    // jump only when standing on the ground
    if(keys['Space'] && grounded){ vy=JUMP; grounded=false; }
    vy-=GRAV*dt; player.y+=vy*dt;
    if(player.y<=groundY){
      // landed — or auto-step up onto a higher step (stairs) when the rise is small
      if(grounded || (groundY-player.y)<=STEP_UP || vy<=0){ player.y=groundY; vy=0; grounded=true; }
    } else { grounded=false; }
    // safety: never fall through the world
    if(player.y<groundY-2){ player.y=groundY; vy=0; grounded=true; }

    var bob=(moving&&grounded)?Math.sin(bobT)*0.045:0;
    camera.position.set(player.x,player.y+bob,player.z);
    camera.quaternion.setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));
  }

  /* ---------------- recording + photo ---------------- */
  var recorder=null, chunks=[];
  function toggleRecord(){ if(recorder&&recorder.state==='recording'){ recorder.stop(); return; }
    var stream=canvas.captureStream(30);
    var mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(function(m){return MediaRecorder.isTypeSupported(m);});
    if(!mime){ alert('Recording not supported in this browser.'); return; }
    chunks=[]; recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6000000});
    recorder.ondataavailable=function(e){ if(e.data.size) chunks.push(e.data); };
    recorder.onstop=function(){ var blob=new Blob(chunks,{type:'video/webm'}); var url=URL.createObjectURL(blob);
      var a=document.createElement('a'); a.href=url; a.download='posada-rembrandt-tour.webm'; a.click(); setTimeout(function(){URL.revokeObjectURL(url);},1000);
      document.getElementById('recBtn').classList.remove('is-on'); document.getElementById('recLbl').textContent=tr('record'); document.getElementById('recIndicator').hidden=true; };
    recorder.start(); document.getElementById('recBtn').classList.add('is-on'); document.getElementById('recLbl').textContent=tr('recording'); document.getElementById('recIndicator').hidden=false;
  }

  /* ---------------- HUD / i18n ---------------- */
  function applyLang(){ document.documentElement.lang=LANG;
    document.getElementById('backLbl').textContent=tr('back');
    document.getElementById('hudSub').textContent=tr('sub');
    document.getElementById('autoLbl').textContent=autoMode?tr('autoStop'):tr('auto');
    document.getElementById('recLbl').textContent=(recorder&&recorder.state==='recording')?tr('recording'):tr('record');
    document.getElementById('photoLbl').textContent=tr('photo');
    document.getElementById('langBtn').textContent=(LANG==='es')?'EN':'ES';
    document.getElementById('startBtnLbl').textContent=tr('enter');
    document.getElementById('startAutoLbl').textContent=autoMode?tr('autoStop'):tr('watch');
    document.getElementById('startLead').textContent=tr('lead');
    document.getElementById('loadingLbl').textContent=tr('building');
    document.getElementById('hintMove').textContent=tr('move');
    document.getElementById('hintLook').textContent=tr('look');
    document.getElementById('hintInspect').textContent=tr('doInspect');
    document.getElementById('hintRun').textContent=tr('run');
    document.getElementById('hintJump').textContent=tr('jump');
    if(!insEl.hidden && hovered && hovered.userData.info) openInspect(hovered.userData.info);
  }
  document.getElementById('langBtn').addEventListener('click', function(){ LANG=(LANG==='es')?'en':'es'; localStorage.setItem('viaje_lang',LANG); applyLang(); });
  document.getElementById('autoBtn').addEventListener('click', function(){ autoMode?stopAuto():startAuto(); });
  document.getElementById('recBtn').addEventListener('click', toggleRecord);
  document.getElementById('photoBtn').addEventListener('click', function(){ renderer.render(scene,camera);
    canvas.toBlob(function(blob){ if(!blob)return; var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='posada-rembrandt.png'; a.click(); setTimeout(function(){URL.revokeObjectURL(url);},1000); },'image/png'); });

  var hintEl=document.getElementById('hudHint'); var hintTimer=null;
  function hideHintSoon(){ clearTimeout(hintTimer); hintTimer=setTimeout(function(){hintEl.classList.add('is-hidden');},7000); }

  var startScreen=document.getElementById('startScreen');
  document.getElementById('startBtn').addEventListener('click', function(){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); requestLock(); hideHintSoon(); });
  document.getElementById('startAuto').addEventListener('click', function(){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); startAuto(); });

  /* ---------------- loop ---------------- */
  var clock=new THREE.Clock();
  function animate(){ requestAnimationFrame(animate);
    var dt=Math.min(clock.getDelta(),0.05), time=clock.elapsedTime;
    animPeople(time);
    if(autoMode) updateAuto(dt,time); else { updateManual(dt); updateHover(); }
    renderer.render(scene,camera);
  }
  window.addEventListener('resize', function(){ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });

  applyLang();
  document.getElementById('loading').classList.add('is-done');
  document.getElementById('crosshair').style.display='none';
  animate();

  /* ---------------- deep links ---------------- */
  var VIEWS={
    reception:{p:[-4,Y0,-3],look:[-8.5,1.2,-6.5]}, bar:{p:[3.5,Y0,-3],look:[8,1.3,-6.6]},
    lounge:{p:[0,Y0,-1.5],look:[0,0.6,-3.6]}, chandelier:{p:[0,Y0,-3.6],look:[0,H2-1.7,-3.5]},
    stairs:{p:[0,Y0,-4.6],look:[0,2.5,-9]}, elevator:{p:[8.5,Y0,-4],look:[11.3,1.4,-9]},
    mezzanine:{p:[0,Y1,-9.4],look:[0,1.6,-3.2]}, room:{p:[6,Y0,-12.5],look:[6,0.85,-15.5]},
    upper:{p:[5.2,Y1,-13.8],look:[6,Y1-0.8,-17]}, pool:{p:[14,Y0,5.2],look:[20,0.4,4]}, facade:{p:[0,Y0,4.5],look:[0,4,-1]}
  };
  (function(){ var q=new URLSearchParams(location.search);
    function enterPlay(){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); hideHintSoon(); }
    if(q.get('auto')==='1'){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); startAuto(); }
    else if(q.get('view') && VIEWS[q.get('view')]){ var v=VIEWS[q.get('view')]; player.set(v.p[0],v.p[1],v.p[2]);
      aimAt(player, v.look[0],v.look[1],v.look[2]); enterPlay(); }
    else if(q.get('play')==='1'){ enterPlay(); }
    else { startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); startAuto(); }
  })();
})();
