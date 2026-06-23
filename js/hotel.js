/* =========================================================
   POSADA REMBRANDT — Virtual Hotel Tour (Three.js r128)
   Procedural hotel · WASD + mouse look · inspectable parts ·
   automatic "guided" tour · in-browser video recording.
   Self-contained: only dependency is three.min.js (CDN).
   ========================================================= */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') {
    document.getElementById('loadingLbl').textContent = 'Error: 3D engine failed to load.';
    return;
  }

  /* ---------------- i18n (shared with main site) ---------------- */
  var LANG = (localStorage.getItem('viaje_lang') === 'es') ? 'es' : 'en';
  var T = {
    en: { back:'Back to site', sub:'Virtual Hotel Tour · 3D', auto:'Auto tour', autoStop:'Stop tour',
      record:'Record', recording:'Stop rec', inspect:'Inspect', enter:'Click to enter',
      watch:'Watch auto tour', building:'Building the hotel…', move:'move', look:'look around',
      doInspect:'inspect', run:'run', component:'COMPONENT',
      lead:'An interactive 3D hotel you can walk through. Move with the keyboard, look with the mouse, and inspect every component. Or let the automatic tour drive — and record it as a video.' },
    es: { back:'Volver al sitio', sub:'Recorrido virtual del hotel · 3D', auto:'Tour automático', autoStop:'Detener tour',
      record:'Grabar', recording:'Detener', inspect:'Inspeccionar', enter:'Haz clic para entrar',
      watch:'Ver tour automático', building:'Construyendo el hotel…', move:'moverte', look:'mirar',
      doInspect:'inspeccionar', run:'correr', component:'COMPONENTE',
      lead:'Un hotel 3D interactivo por el que puedes caminar. Muévete con el teclado, mira con el mouse e inspecciona cada componente. O deja que el recorrido automático conduzca — y grábalo en video.' }
  };
  function tr(k){ return (T[LANG] && T[LANG][k]) || T.en[k] || k; }

  /* ---------------- renderer / scene / camera ---------------- */
  var canvas = document.getElementById('scene');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb9c4cf);
  scene.fog = new THREE.Fog(0xc2bdb2, 38, 120);

  var camera = new THREE.PerspectiveCamera(72, window.innerWidth/window.innerHeight, 0.05, 400);

  /* ---------------- lights ---------------- */
  var hemi = new THREE.HemisphereLight(0xdfe6ee, 0x70604f, 0.85);
  scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffe6bf, 1.55);
  sun.position.set(34, 46, 24);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 160;
  sun.shadow.camera.left = -55; sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0x9fb8d8, 0.35);
  fill.position.set(-30, 20, -20);
  scene.add(fill);

  /* ---------------- helpers ---------------- */
  function mat(color, rough, metal){ return new THREE.MeshStandardMaterial({ color:color, roughness:rough==null?0.85:rough, metalness:metal==null?0:metal }); }
  function box(w,h,d,m){ var g=new THREE.BoxGeometry(w,h,d); var me=new THREE.Mesh(g,m); me.castShadow=true; me.receiveShadow=true; return me; }

  // Canvas-generated texture helper
  function canvasTex(size, draw, repeat){
    var c=document.createElement('canvas'); c.width=c.height=size;
    draw(c.getContext('2d'), size);
    var t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping;
    if(repeat) t.repeat.set(repeat[0],repeat[1]);
    t.anisotropy=4; t.encoding=THREE.sRGBEncoding; return t;
  }

  var PAL = { sand:0xcaa775, sandDark:0xb08f5e, cream:0xece0cd, wood:0x6e4a2c, woodDark:0x4f351f,
    terra:0xc25a33, gold:0xd8a23a, marble:0xe8e0d2, carpet:0x7a342a, glass:0x9fc0cc, dark:0x2a2027 };

  var WALLS = [];                 // AABB colliders {x1,x2,z1,z2}
  var INTERACTABLES = [];         // {mesh, name:{en,es}, desc:{en,es}, note:{en,es}}
  function addCollider(cx,cz,w,d){ WALLS.push({x1:cx-w/2, x2:cx+w/2, z1:cz-d/2, z2:cz+d/2}); }
  function tagObject(obj, info){ obj.userData.info = info; INTERACTABLES.push(obj); obj.traverse(function(o){ o.userData.root = obj; }); }

  var world = new THREE.Group(); scene.add(world);

  /* ---------------- ground & plaza ---------------- */
  var groundTex = canvasTex(256, function(ctx,s){
    ctx.fillStyle='#b6a079'; ctx.fillRect(0,0,s,s);
    for(var i=0;i<2200;i++){ ctx.fillStyle='rgba('+(150+Math.random()*40|0)+','+(130+Math.random()*40|0)+','+(95+Math.random()*30|0)+',.5)';
      ctx.fillRect(Math.random()*s,Math.random()*s,2,2); }
  }, [40,40]);
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(300,300), new THREE.MeshStandardMaterial({map:groundTex, roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; world.add(ground);

  // stone plaza in front of the hotel
  var plazaTex = canvasTex(256, function(ctx,s){
    ctx.fillStyle='#cdb79a'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(90,70,50,.35)'; ctx.lineWidth=3;
    for(var i=0;i<=s;i+=32){ ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(s,i);ctx.stroke(); }
  }, [8,8]);
  var plaza = new THREE.Mesh(new THREE.PlaneGeometry(34,22), new THREE.MeshStandardMaterial({map:plazaTex, roughness:.92}));
  plaza.rotation.x=-Math.PI/2; plaza.position.set(0,0.02,11); plaza.receiveShadow=true; world.add(plaza);

  /* ---------------- materials ---------------- */
  var facadeTex = canvasTex(256, function(ctx,s){
    ctx.fillStyle='#caa775'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(120,95,62,.30)'; ctx.lineWidth=2;
    for(var y=0;y<s;y+=42){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(s,y);ctx.stroke(); }
    for(var i=0;i<700;i++){ ctx.fillStyle='rgba('+(170+Math.random()*40|0)+','+(140+Math.random()*30|0)+',95,.25)'; ctx.fillRect(Math.random()*s,Math.random()*s,3,3); }
  }, [3,2]);
  var facadeMat = new THREE.MeshStandardMaterial({ map:facadeTex, roughness:.95 });
  var creamMat  = mat(PAL.cream, .9);
  var carpetTex = canvasTex(128, function(ctx,s){ ctx.fillStyle='#7a342a'; ctx.fillRect(0,0,s,s);
    for(var i=0;i<900;i++){ ctx.fillStyle='rgba('+(120+Math.random()*40|0)+',50,40,.4)'; ctx.fillRect(Math.random()*s,Math.random()*s,2,2);} }, [10,10]);
  var carpetMat = new THREE.MeshStandardMaterial({ map:carpetTex, roughness:1 });
  var marbleTex = canvasTex(256, function(ctx,s){ ctx.fillStyle='#e8e0d2'; ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='rgba(150,140,120,.3)'; ctx.lineWidth=2;
    for(var i=0;i<=s;i+=64){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,s);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(s,i);ctx.stroke();}
    ctx.strokeStyle='rgba(120,110,95,.18)';
    for(var k=0;k<40;k++){ctx.beginPath();ctx.moveTo(Math.random()*s,Math.random()*s);ctx.bezierCurveTo(Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s,Math.random()*s);ctx.stroke();}
  }, [4,3]);
  var marbleMat = new THREE.MeshStandardMaterial({ map:marbleTex, roughness:.4, metalness:.05 });
  var woodMat = mat(PAL.wood,.6), woodDarkMat=mat(PAL.woodDark,.55);
  var goldMat = mat(PAL.gold,.32,.85), terraMat=mat(PAL.terra,.7);
  var glassMat = new THREE.MeshStandardMaterial({ color:PAL.glass, roughness:.12, metalness:.1, transparent:true, opacity:.45 });

  /* ---------------- geometry helpers (walls with door gaps) ---------------- */
  var WT = 0.4;          // wall thickness
  var H  = 4.6;          // interior wall height
  var OPEN = 3.0;        // doorway opening height

  // wall running along X at fixed z, from x0..x1, optional gap [gx0,gx1]
  function wallX(z, x0, x1, gap, m, h){
    h = h||H; m = m||creamMat;
    var segs=[];
    if(gap){ segs.push([x0,gap[0]]); segs.push([gap[1],x1]); } else segs.push([x0,x1]);
    segs.forEach(function(s){
      var w=s[1]-s[0]; if(w<=0.01) return; var cx=(s[0]+s[1])/2;
      var me=box(w,h,WT,m); me.position.set(cx,h/2,z); world.add(me);
      addCollider(cx,z,w,WT);
    });
    if(gap){ var lw=gap[1]-gap[0]; var lin=box(lw,h-OPEN,WT,m); lin.position.set((gap[0]+gap[1])/2,(OPEN+(h-OPEN)/2),z); world.add(lin); }
  }
  // wall running along Z at fixed x
  function wallZ(x, z0, z1, gap, m, h){
    h=h||H; m=m||creamMat;
    var segs=[];
    if(gap){ segs.push([z0,gap[0]]); segs.push([gap[1],z1]); } else segs.push([z0,z1]);
    segs.forEach(function(s){
      var d=s[1]-s[0]; if(d<=0.01) return; var cz=(s[0]+s[1])/2;
      var me=box(WT,h,d,m); me.position.set(x,h/2,cz); world.add(me);
      addCollider(x,cz,WT,d);
    });
    if(gap){ var ld=gap[1]-gap[0]; var lin=box(WT,h-OPEN,ld,m); lin.position.set(x,(OPEN+(h-OPEN)/2),(gap[0]+gap[1])/2); world.add(lin); }
  }

  /* ============================================================
     BUILD THE HOTEL
     Interior footprint: x[-10,10], z[-15,0]. Entrance faces +z.
     ============================================================ */

  // ---- Interior floors ----
  var lobbyFloor = new THREE.Mesh(new THREE.PlaneGeometry(20,15), marbleMat);
  lobbyFloor.rotation.x=-Math.PI/2; lobbyFloor.position.set(0,0.04,-7.5); lobbyFloor.receiveShadow=true; world.add(lobbyFloor);

  // ---- Ceiling ----
  var ceil = new THREE.Mesh(new THREE.PlaneGeometry(20,15), mat(0xe6dccb,.95));
  ceil.rotation.x=Math.PI/2; ceil.position.set(0,H,-7.5); ceil.receiveShadow=true; world.add(ceil);

  // ---- Exterior tall facade (front, z=0) with windows on an upper floor ----
  // ground floor: walls left/right of the 3m-wide entrance
  wallX(0, -10, 10, [-1.6,1.6], facadeMat, H);
  // upper facade band (z=0) above the ground floor, full width, 4.4m tall (to ~9m)
  var upper = box(20.8, 4.4, WT, facadeMat); upper.position.set(0, H+2.2, 0); world.add(upper);
  // parapet cap
  var cap = box(21.4, 0.5, 0.9, mat(PAL.sandDark,.9)); cap.position.set(0,9.05,0); world.add(cap);
  // entrance canopy
  var canopy = box(5.2,0.3,2.4, terraMat); canopy.position.set(0, OPEN+0.15, 1.1); world.add(canopy);
  var post1=box(0.25,OPEN,0.25,woodDarkMat); post1.position.set(-2.3,OPEN/2,2.1); world.add(post1);
  var post2=post1.clone(); post2.position.x=2.3; world.add(post2);

  // upper-floor windows (emissive panes for a "lit" look)
  var winMat = new THREE.MeshStandardMaterial({ color:0x21262e, roughness:.1, metalness:.2, emissive:0xffd98a, emissiveIntensity:.18 });
  for(var wx=-8; wx<=8; wx+=3.2){
    var win=box(1.7,2.2,0.12, winMat); win.position.set(wx, H+2.3, 0.16); world.add(win);
    var fr=box(2.0,2.5,0.16, woodDarkMat); fr.position.set(wx,H+2.3,0.05); world.add(fr);
    win.position.z=0.18;
  }
  // hotel sign over the canopy
  var signPanel = box(6.2,1.0,0.18, mat(PAL.dark,.6)); signPanel.position.set(0, H+0.55, 0.2); world.add(signPanel);
  var signTex = canvasTex(512, function(ctx,s){
    ctx.clearRect(0,0,s,s);              // transparent background
    ctx.font='bold 64px Georgia, serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#e2a93e'; ctx.fillText('POSADA REMBRANDT', s/2, s*0.5);
  });
  var signMat=new THREE.MeshStandardMaterial({ map:signTex, transparent:true, emissive:0xe2a93e, emissiveIntensity:.5, emissiveMap:signTex });
  var signText=new THREE.Mesh(new THREE.PlaneGeometry(6.0,1.5), signMat); signText.position.set(0,H+0.55,0.32); world.add(signText);
  tagObject(signPanel, { name:{en:'Hotel facade & sign',es:'Fachada y letrero del hotel'},
    desc:{en:'A two-storey sandstone facade in the warm Guanajuato palette — pink-quarry tones, a terracotta canopy and a gold-lit sign. The upper windows glow to suggest occupied rooms.',
      es:'Una fachada de cantera de dos niveles en la paleta cálida de Guanajuato — tonos de cantera rosa, una marquesina de terracota y un letrero iluminado en dorado. Las ventanas superiores brillan para sugerir habitaciones ocupadas.'},
    note:{en:'Modelled with extruded boxes; the sign is a canvas-drawn emissive texture.',es:'Modelado con cajas extruidas; el letrero es una textura emisiva dibujada en canvas.'} });

  // ---- Side & back walls ----
  wallZ(-10, -15, 0, null, facadeMat, H);     // west
  wallZ( 10, -15, 0, null, facadeMat, H);     // east
  wallX(-15, -10, 10, null, creamMat, H);     // back

  // ---- Partition lobby / back corridor (z=-8) with central door ----
  wallX(-8, -10, 10, [-1.4,1.4], creamMat, H);
  // corridor carpet
  var corr = new THREE.Mesh(new THREE.PlaneGeometry(20,7), carpetMat);
  corr.rotation.x=-Math.PI/2; corr.position.set(0,0.05,-11.5); corr.receiveShadow=true; world.add(corr);

  // ---- Guest room (right back): walls x=2 (z -15..-8, door gap), room behind ----
  wallZ(2, -15, -8, [-12.4,-10.8], creamMat, H);
  var roomFloor=new THREE.Mesh(new THREE.PlaneGeometry(8,7), mat(0x8a5a3e,.85));
  roomFloor.rotation.x=-Math.PI/2; roomFloor.position.set(6,0.05,-11.5); roomFloor.receiveShadow=true; world.add(roomFloor);

  /* ---------------- RECEPTION DESK ---------------- */
  (function(){
    var g=new THREE.Group();
    var base=box(6,1.1,1.4, woodMat); base.position.y=0.55; g.add(base);
    var top=box(6.4,0.12,1.7, mat(PAL.dark,.3,.1)); top.position.y=1.16; g.add(top);
    var front=box(6,0.9,0.08, goldMat); front.position.set(0,0.6,0.74); g.add(front);
    // back wall logo board
    var board=box(5,2.2,0.15, woodDarkMat); board.position.set(0,1.7,-1.2); g.add(board);
    var bell=new THREE.Mesh(new THREE.SphereGeometry(0.16,18,12,0,Math.PI*2,0,Math.PI/2), goldMat);
    bell.position.set(2,1.28,0.2); bell.castShadow=true; g.add(bell);
    g.position.set(0,0,-6.4); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(0,-6.4,6.4,1.7);
    tagObject(base, { name:{en:'Reception desk',es:'Recepción'},
      desc:{en:'The heart of the lobby: a walnut desk with a brass front panel and a service bell. This is where a guest checks in — the first human point of the hotel experience.',
        es:'El corazón del vestíbulo: un mostrador de nogal con panel frontal de latón y un timbre de servicio. Aquí el huésped se registra — el primer punto humano de la experiencia del hotel.'},
      note:{en:'Try the auto tour to see the camera pause here, as a real guest would.',es:'Prueba el tour automático para ver la cámara detenerse aquí, como lo haría un huésped real.'} });
  })();

  /* ---------------- CHANDELIER ---------------- */
  (function(){
    var g=new THREE.Group();
    var rod=box(0.06,1.2,0.06, goldMat); rod.position.y=H-0.6; g.add(rod);
    var ring=new THREE.Mesh(new THREE.TorusGeometry(0.9,0.06,10,28), goldMat); ring.rotation.x=Math.PI/2; ring.position.y=H-1.2; g.add(ring);
    var light=new THREE.PointLight(0xffd9a0, 0.9, 18, 1.6); light.position.set(0,H-1.3,0); g.add(light);
    var core=new THREE.Mesh(new THREE.SphereGeometry(0.18,16,16), new THREE.MeshStandardMaterial({color:0xfff2d6,emissive:0xffd98a,emissiveIntensity:1.3})); core.position.y=H-1.3; g.add(core);
    for(var a=0;a<8;a++){ var an=a/8*Math.PI*2;
      var b=new THREE.Mesh(new THREE.SphereGeometry(0.09,12,12), new THREE.MeshStandardMaterial({color:0xfff2d6,emissive:0xffce7a,emissiveIntensity:1.1}));
      b.position.set(Math.cos(an)*0.9, H-1.35, Math.sin(an)*0.9); g.add(b);
    }
    g.position.set(0,0,-3.5); g.traverse(function(o){o.castShadow=false;}); world.add(g);
    tagObject(core, { name:{en:'Lobby chandelier',es:'Candil del vestíbulo'},
      desc:{en:'A brass ring chandelier with eight warm bulbs and a glowing core, casting golden light over the marble floor. Look up to inspect it.',
        es:'Un candil de aro de latón con ocho focos cálidos y un núcleo luminoso, que arroja luz dorada sobre el piso de mármol. Mira hacia arriba para inspeccionarlo.'},
      note:{en:'A real Three.js PointLight — the glow you see is its actual illumination.',es:'Una PointLight real de Three.js — el resplandor que ves es su iluminación real.'} });
  })();

  /* ---------------- LOBBY SOFA + TABLE + PLANT ---------------- */
  function sofa(x,z,rot){
    var g=new THREE.Group();
    var seat=box(2.4,0.4,0.95, terraMat); seat.position.y=0.42; g.add(seat);
    var back=box(2.4,0.7,0.25, terraMat); back.position.set(0,0.75,-0.35); g.add(back);
    var ar1=box(0.25,0.55,0.95, terraMat); ar1.position.set(-1.07,0.55,0); g.add(ar1);
    var ar2=ar1.clone(); ar2.position.x=1.07; g.add(ar2);
    g.position.set(x,0,z); g.rotation.y=rot||0; g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(x,z,rot?0.95:2.4, rot?2.4:0.95);
    return seat;
  }
  var s1=sofa(-6,-3.6,0);
  sofa(-6,-1.2,Math.PI);
  var ctable=box(1.3,0.4,0.8, woodDarkMat); ctable.position.set(-6,0.2,-2.4); ctable.castShadow=true; ctable.receiveShadow=true; world.add(ctable); addCollider(-6,-2.4,1.3,0.8);
  // potted plant
  function plant(x,z){ var g=new THREE.Group();
    var pot=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.22,0.5,16), terraMat); pot.position.y=0.25; g.add(pot);
    for(var i=0;i<5;i++){ var leaf=new THREE.Mesh(new THREE.ConeGeometry(0.18,1.0,8), mat(0x3f6b3a,.8));
      leaf.position.set((Math.random()-.5)*0.3,0.9+Math.random()*0.3,(Math.random()-.5)*0.3); leaf.rotation.z=(Math.random()-.5)*0.6; g.add(leaf); }
    g.position.set(x,0,z); g.traverse(function(o){o.castShadow=true;}); world.add(g); addCollider(x,z,0.6,0.6); }
  plant(-9.2,-0.8); plant(9.2,-0.8); plant(8.4,-7.4);
  tagObject(s1, { name:{en:'Lobby lounge',es:'Sala de estar'},
    desc:{en:'A terracotta lounge set facing a low walnut coffee table — a place for guests to wait, read or talk. The deep red echoes the carpets of colonial Guanajuato interiors.',
      es:'Un juego de sala en terracota frente a una mesa baja de nogal — un lugar para que los huéspedes esperen, lean o conversen. El rojo profundo evoca los tapetes de los interiores coloniales de Guanajuato.'},
    note:{en:'',es:''} });

  /* ---------------- ELEVATOR + STAIRS ---------------- */
  (function(){
    var frame=box(2.4,3.0,0.3, mat(PAL.sandDark,.8)); frame.position.set(8.6,1.5,-7.7); frame.castShadow=true; world.add(frame);
    var dL=box(0.95,2.6,0.1, goldMat); dL.position.set(8.2,1.3,-7.55); world.add(dL);
    var dR=dL.clone(); dR.position.x=9.0; world.add(dR);
    addCollider(8.6,-7.7,2.4,0.3);
    tagObject(frame,{ name:{en:'Elevator',es:'Elevador'},
      desc:{en:'A pair of polished brass elevator doors set into a stone frame. In a full build this would carry guests to the glowing upper floors you saw outside.',
        es:'Un par de puertas de elevador en latón pulido en un marco de cantera. En una versión completa llevaría a los huéspedes a los pisos superiores iluminados que viste afuera.'},
      note:{en:'',es:''} });
    // decorative staircase (left back)
    var sg=new THREE.Group();
    for(var i=0;i<7;i++){ var step=box(2.2,0.18,0.5, marbleMat); step.position.set(0, 0.18*i+0.09, -i*0.5); sg.add(step); }
    var rail=box(0.08,1.0,3.6, goldMat); rail.position.set(1.0,1.2,-1.5); rail.rotation.x=-0.5; sg.add(rail);
    sg.position.set(-8.4,0,-7.0); sg.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(sg);
    addCollider(-8.4,-8.0,2.4,3.5);
    tagObject(sg.children[0],{ name:{en:'Grand staircase',es:'Escalera principal'},
      desc:{en:'A marble staircase with a brass handrail rising toward the mezzanine — a classic lobby centrepiece and a nod to the 113-step stairway of the University of Guanajuato.',
        es:'Una escalera de mármol con barandal de latón que sube hacia el entresuelo — una pieza clásica del vestíbulo y un guiño a la escalinata de 113 escalones de la Universidad de Guanajuato.'},
      note:{en:'',es:''} });
  })();

  /* ---------------- FRAMED PAINTING (Guanajuato photo) ---------------- */
  (function(){
    var loader=new THREE.TextureLoader();
    var ptex=loader.load('assets/img/gto-panorama.jpg'); ptex.encoding=THREE.sRGBEncoding;
    var frame=box(3.4,2.2,0.12, goldMat); frame.position.set(0,2.2,-7.78); world.add(frame);
    var art=new THREE.Mesh(new THREE.PlaneGeometry(3.0,1.8), new THREE.MeshStandardMaterial({map:ptex, roughness:.6}));
    art.position.set(0,2.2,-7.7); world.add(art);
    var spot=new THREE.SpotLight(0xfff0d0,0.6,10,0.7,0.5); spot.position.set(0,4.2,-5.5); spot.target=art; scene.add(spot); scene.add(spot.target);
    tagObject(frame,{ name:{en:'Guanajuato panorama',es:'Panorámica de Guanajuato'},
      desc:{en:'A framed photograph of Guanajuato Capital hanging behind reception — a real image from the expedition, tying the virtual hotel back to the city the project is about.',
        es:'Una fotografía enmarcada de Guanajuato Capital colgada tras la recepción — una imagen real de la expedición, que une el hotel virtual con la ciudad de la que trata el proyecto.'},
      note:{en:'Loaded from assets/img/gto-panorama.jpg — the same photo used on the home page hero.',es:'Cargada desde assets/img/gto-panorama.jpg — la misma foto del hero de la portada.'} });
  })();

  /* ---------------- GUEST ROOM: bed, nightstand, lamp, window ---------------- */
  (function(){
    // bed
    var g=new THREE.Group();
    var fr=box(2.4,0.5,3.0, woodMat); fr.position.y=0.3; g.add(fr);
    var mattr=box(2.2,0.35,2.8, mat(0xf2ead9,.9)); mattr.position.y=0.62; g.add(mattr);
    var head=box(2.4,1.1,0.2, woodDarkMat); head.position.set(0,0.85,-1.5); g.add(head);
    var pil1=box(0.9,0.2,0.5, mat(0xffffff,.8)); pil1.position.set(-0.5,0.85,-1.1); g.add(pil1);
    var pil2=pil1.clone(); pil2.position.x=0.5; g.add(pil2);
    var runner=box(2.2,0.06,1.0, terraMat); runner.position.set(0,0.81,0.7); g.add(runner);
    g.position.set(6.5,0,-12.5); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(6.5,-12.5,2.4,3.0);
    tagObject(fr,{ name:{en:'King bed',es:'Cama king'},
      desc:{en:'A king bed with a walnut frame, white linens and a terracotta runner. Behind the guest-room door, this is the private heart of the suite.',
        es:'Una cama king con base de nogal, ropa de cama blanca y un pie de cama en terracota. Tras la puerta de la habitación, este es el corazón privado de la suite.'},
      note:{en:'',es:''} });
    // nightstand + lamp
    var ns=box(0.6,0.6,0.6, woodDarkMat); ns.position.set(4.7,0.3,-12.6); ns.castShadow=true; world.add(ns); addCollider(4.7,-12.6,0.6,0.6);
    var lampBase=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.12,0.45,12), goldMat); lampBase.position.set(4.7,0.83,-12.6); world.add(lampBase);
    var shade=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,0.32,16), new THREE.MeshStandardMaterial({color:0xfff0d0,emissive:0xffce85,emissiveIntensity:.8})); shade.position.set(4.7,1.15,-12.6); world.add(shade);
    var lampLight=new THREE.PointLight(0xffcaa0,0.5,6,2); lampLight.position.set(4.7,1.15,-12.6); world.add(lampLight);
    tagObject(shade,{ name:{en:'Bedside lamp',es:'Lámpara de buró'},
      desc:{en:'A small brass lamp casting a pool of warm light over the nightstand — the kind of detail that makes a 3D room feel lived-in.',
        es:'Una pequeña lámpara de latón que arroja un charco de luz cálida sobre el buró — el tipo de detalle que hace que una habitación 3D se sienta habitada.'},
      note:{en:'',es:''} });
    // window with exterior view (on back wall z=-15, inside room)
    var wframe=box(2.2,1.8,0.16, woodDarkMat); wframe.position.set(7,2.0,-14.85); world.add(wframe);
    var wglass=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.5), new THREE.MeshStandardMaterial({color:0xbcd6e6, roughness:.05, metalness:.1, emissive:0x88aac0, emissiveIntensity:.3})); wglass.position.set(7,2.0,-14.76); wglass.rotation.y=Math.PI; world.add(wglass);
    tagObject(wframe,{ name:{en:'Guest-room window',es:'Ventana de la habitación'},
      desc:{en:'A window framing the morning sky beyond the room. Daylight from outside spills across the floor, balancing the warm lamp.',
        es:'Una ventana que enmarca el cielo de la mañana más allá de la habitación. La luz del día entra y se reparte por el piso, equilibrando la lámpara cálida.'},
      note:{en:'',es:''} });
  })();

  /* ---------------- EXTERIOR: fountain, pool, palms, lamps ---------------- */
  (function(){
    // fountain in the plaza
    var g=new THREE.Group();
    var basin=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.8,0.6,28), mat(PAL.sandDark,.9)); basin.position.y=0.3; g.add(basin);
    var water=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,0.1,28), new THREE.MeshStandardMaterial({color:0x4f8fa6,roughness:.1,metalness:.2,transparent:true,opacity:.8})); water.position.y=0.58; g.add(water);
    var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.28,1.1,16), mat(PAL.sandDark,.9)); stem.position.y=1.0; g.add(stem);
    var bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.2,0.3,18), mat(PAL.sandDark,.9)); bowl.position.y=1.6; g.add(bowl);
    g.position.set(0,0,9); g.traverse(function(o){o.castShadow=true;o.receiveShadow=true;}); world.add(g);
    addCollider(0,9,3.6,3.6);
    tagObject(basin,{ name:{en:'Plaza fountain',es:'Fuente de la plaza'},
      desc:{en:'A two-tier stone fountain on the entrance plaza — the kind of welcome courtyard found in front of colonial Mexican posadas.',
        es:'Una fuente de cantera de dos niveles en la plaza de entrada — el tipo de patio de bienvenida que se encuentra frente a las posadas coloniales mexicanas.'},
      note:{en:'',es:''} });
    // swimming pool to the east
    var pool=new THREE.Mesh(new THREE.BoxGeometry(8,0.3,5), new THREE.MeshStandardMaterial({color:0x2f97b8,roughness:.08,metalness:.25,transparent:true,opacity:.86})); pool.position.set(18,0.15,4); world.add(pool);
    var deck=new THREE.Mesh(new THREE.PlaneGeometry(11,8), new THREE.MeshStandardMaterial({color:0xd8c6a4,roughness:.9})); deck.rotation.x=-Math.PI/2; deck.position.set(18,0.03,4); deck.receiveShadow=true; world.add(deck);
    tagObject(pool,{ name:{en:'Swimming pool',es:'Alberca'},
      desc:{en:'An outdoor pool on a sandstone deck beside the hotel. The water uses a glossy, semi-transparent material so the sky reflects across its surface.',
        es:'Una alberca al aire libre sobre una cubierta de cantera junto al hotel. El agua usa un material brillante y semitransparente para que el cielo se refleje en su superficie.'},
      note:{en:'',es:''} });
    // palms
    function palm(x,z){ var pg=new THREE.Group();
      var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.26,3.4,10), woodMat); trunk.position.y=1.7; pg.add(trunk);
      for(var i=0;i<7;i++){ var fr=new THREE.Mesh(new THREE.ConeGeometry(0.3,2.0,6), mat(0x3f7a3c,.8));
        var an=i/7*Math.PI*2; fr.position.set(Math.cos(an)*0.7,3.5,Math.sin(an)*0.7); fr.rotation.z=Math.cos(an)*0.9; fr.rotation.x=Math.sin(an)*0.9; pg.add(fr); }
      pg.position.set(x,0,z); pg.traverse(function(o){o.castShadow=true;}); world.add(pg); addCollider(x,z,0.5,0.5); }
    palm(-7,7); palm(7,7); palm(12,8); palm(24,6);
  })();

  /* ---------------- ambient extra interior light ---------------- */
  var amb1=new THREE.PointLight(0xffe0b0,0.4,16,2); amb1.position.set(-5,3.5,-11); scene.add(amb1);
  var amb2=new THREE.PointLight(0xffe0b0,0.35,16,2); amb2.position.set(6,3.5,-3); scene.add(amb2);

  /* ============================================================
     PLAYER CONTROLS
     ============================================================ */
  var R = 0.42;                       // player collision radius
  var EYE = 1.65;
  var player = new THREE.Vector3(0, EYE, 14);   // spawn outside, facing the hotel
  var yaw = Math.PI, pitch = 0;                 // look toward -z (hotel)
  var vel = new THREE.Vector3();
  var keys = {};
  var locked = false, autoMode = false;
  var bobT = 0;

  function collides(x,z){
    for(var i=0;i<WALLS.length;i++){ var w=WALLS[i];
      if(x>w.x1-R && x<w.x2+R && z>w.z1-R && z<w.z2+R) return true; }
    return false;
  }

  // pointer lock
  function requestLock(){ if(!autoMode) canvas.requestPointerLock(); }
  document.addEventListener('pointerlockchange', function(){
    locked = (document.pointerLockElement === canvas);
    document.getElementById('crosshair').style.display = (locked||autoMode)?'grid':'none';
  });
  document.addEventListener('mousemove', function(e){
    if(!locked || autoMode) return;
    yaw   -= e.movementX * 0.0022;
    pitch -= e.movementY * 0.0022;
    pitch = Math.max(-1.4, Math.min(1.4, pitch));
  });
  window.addEventListener('keydown', function(e){ keys[e.code]=true;
    if(e.code==='KeyE'){ tryInspect(); }
    if(e.code==='Escape'){ closeInspect(); }
  });
  window.addEventListener('keyup', function(e){ keys[e.code]=false; });

  // click to lock / inspect
  canvas.addEventListener('click', function(){
    if(autoMode) return;
    if(!locked){ requestLock(); }
    else { tryInspect(); }
  });

  /* ============================================================
     RAYCAST INSPECTION
     ============================================================ */
  var ray = new THREE.Raycaster(); ray.far = 6;
  var center = new THREE.Vector2(0,0);
  var hovered = null;
  var promptEl=document.getElementById('prompt'), promptText=document.getElementById('promptText');
  var crossEl=document.getElementById('crosshair');

  function updateHover(){
    if(autoMode){ return; }
    ray.setFromCamera(center, camera);
    var hits = ray.intersectObjects(INTERACTABLES, true);
    var found=null;
    if(hits.length){ var o=hits[0].object; found = o.userData.root || o; }
    hovered = found;
    if(found && insEl.hidden){
      promptText.textContent = tr('inspect');
      promptEl.hidden=false; crossEl.classList.add('is-hot');
    } else {
      promptEl.hidden=true; crossEl.classList.remove('is-hot');
    }
  }
  function tryInspect(){ if(hovered && hovered.userData.info) openInspect(hovered.userData.info); }

  var insEl=document.getElementById('inspect');
  function openInspect(info){
    document.getElementById('inspectTag').textContent = tr('component');
    document.getElementById('inspectTitle').textContent = info.name[LANG]||info.name.en;
    document.getElementById('inspectDesc').textContent = info.desc[LANG]||info.desc.en;
    var note=(info.note&&(info.note[LANG]||info.note.en))||'';
    document.getElementById('inspectNote').textContent = note;
    insEl.hidden=false;
  }
  function closeInspect(){ insEl.hidden=true; }
  document.getElementById('inspectClose').addEventListener('click', closeInspect);

  /* ============================================================
     AUTO TOUR (guided, "someone is playing")
     ============================================================ */
  var WP = [
    { pos:[0,EYE,16],   look:[0,3,0],     dwell:1.2, info:null },           // approach
    { pos:[0,EYE,9.5],  look:[0,1,9],     dwell:2.6, infoName:'Plaza fountain' },
    { pos:[0,EYE,4],    look:[0,5,-2],    dwell:1.6, infoName:'Hotel facade & sign' },
    { pos:[0,EYE,-1.5], look:[0,1,-6.4],  dwell:2.8, infoName:'Reception desk' },
    { pos:[-3,EYE,-3],  look:[0,4.2,-3.5],dwell:2.4, infoName:'Lobby chandelier' },
    { pos:[-6,EYE,-3],  look:[-6,1,-2.4], dwell:2.4, infoName:'Lobby lounge' },
    { pos:[0,EYE,-5.2], look:[0,2.2,-7.7],dwell:2.6, infoName:'Guanajuato panorama' },
    { pos:[8,EYE,-5.5], look:[8.6,1.5,-7.7],dwell:2.2, infoName:'Elevator' },
    { pos:[0,EYE,-9.5], look:[6,1,-12.5], dwell:1.4, info:null },           // into corridor
    { pos:[5,EYE,-11.5],look:[6.5,1,-12.5],dwell:2.8, infoName:'King bed' },
    { pos:[6,EYE,-11.5],look:[4.7,1.1,-12.6],dwell:2.2, infoName:'Bedside lamp' },
    { pos:[6.5,EYE,-12],look:[7,2,-15],   dwell:2.4, infoName:'Guest-room window' },
    { pos:[0,EYE,-4],   look:[8,1,4],      dwell:1.6, info:null },          // back to lobby
    { pos:[14,EYE,5],   look:[18,0.4,4],   dwell:2.6, infoName:'Swimming pool' },
    { pos:[6,EYE,12],   look:[0,3,0],      dwell:2.0, info:null }           // step back & loop
  ];
  // resolve infoName -> info object
  WP.forEach(function(w){ if(w.infoName){ for(var i=0;i<INTERACTABLES.length;i++){ var inf=INTERACTABLES[i].userData.info; if(inf && inf.name.en===w.infoName){ w.info=inf; break; } } } });

  var aIdx=0, aPhase='move', aT=0, aTimer=0;
  var aStartPos=new THREE.Vector3(), aStartLook=new THREE.Vector3();
  var dummy=new THREE.Object3D();
  var lookCur=new THREE.Vector3();

  function startAuto(){
    autoMode=true; if(document.pointerLockElement) document.exitPointerLock();
    promptEl.hidden=true; crossEl.classList.remove('is-hot');
    aIdx=0; aPhase='move'; aT=0;
    aStartPos.copy(player);
    // current look point
    var dir=new THREE.Vector3(); camera.getWorldDirection(dir); aStartLook.copy(player).add(dir.multiplyScalar(5));
    lookCur.copy(aStartLook);
    document.getElementById('autoBtn').classList.add('is-on');
    document.getElementById('autoLbl').textContent=tr('autoStop');
    document.getElementById('startAutoLbl').textContent=tr('autoStop');
    hideHintSoon();
  }
  function stopAuto(){
    autoMode=false; closeInspect();
    document.getElementById('autoBtn').classList.remove('is-on');
    document.getElementById('autoLbl').textContent=tr('auto');
    document.getElementById('startAutoLbl').textContent=tr('watch');
    // sync manual yaw/pitch from current camera
    var e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ'); yaw=e.y; pitch=e.x;
  }
  function easeIO(t){ return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }

  function updateAuto(dt, time){
    var target=WP[aIdx];
    if(aPhase==='move'){
      var seg = Math.max(1.4, aStartPos.distanceTo(new THREE.Vector3(target.pos[0],target.pos[1],target.pos[2]))/2.4);
      aT += dt/seg;
      var k=easeIO(Math.min(aT,1));
      player.set(
        aStartPos.x+(target.pos[0]-aStartPos.x)*k,
        target.pos[1],
        aStartPos.z+(target.pos[2]-aStartPos.z)*k
      );
      lookCur.set(
        aStartLook.x+(target.look[0]-aStartLook.x)*k,
        aStartLook.y+(target.look[1]-aStartLook.y)*k,
        aStartLook.z+(target.look[2]-aStartLook.z)*k
      );
      if(aT>=1){ aPhase='dwell'; aTimer=target.dwell; if(target.info) openInspect(target.info); else closeInspect(); }
    } else {
      aTimer-=dt;
      if(aTimer<=0){
        aPhase='move'; aT=0;
        aStartPos.copy(player); aStartLook.copy(lookCur);
        aIdx=(aIdx+1)%WP.length;
        if(aIdx===0){ /* looped */ }
        closeInspect();
      }
    }
    // human-like sway + head bob
    var swayX=Math.sin(time*0.55)*1.4, swayY=Math.sin(time*0.8)*0.35;
    var bob=Math.sin(time*5.0)*0.035;
    camera.position.set(player.x, player.y+bob, player.z);
    dummy.position.copy(camera.position);
    dummy.lookAt(lookCur.x+swayX, lookCur.y+swayY, lookCur.z);
    camera.quaternion.slerp(dummy.quaternion, 1-Math.pow(0.001, dt));
  }

  /* ============================================================
     MANUAL UPDATE
     ============================================================ */
  function updateManual(dt){
    var speed = (keys['ShiftLeft']||keys['ShiftRight']) ? 7.2 : 3.8;
    var fwd=0, str=0;
    if(keys['KeyW']||keys['ArrowUp']) fwd+=1;
    if(keys['KeyS']||keys['ArrowDown']) fwd-=1;
    if(keys['KeyD']||keys['ArrowRight']) str+=1;
    if(keys['KeyA']||keys['ArrowLeft']) str-=1;
    var sin=Math.sin(yaw), cos=Math.cos(yaw);
    // forward is -z when yaw aims there
    var dx = (-sin*fwd + cos*str);
    var dz = (-cos*fwd - sin*str);
    var len=Math.hypot(dx,dz)||1; dx/=len; dz/=len;
    var moving = (fwd||str);
    if(moving){
      var step=speed*dt;
      var nx=player.x+dx*step, nz=player.z+dz*step;
      if(!collides(nx, player.z)) player.x=nx;
      if(!collides(player.x, nz)) player.z=nz;
      bobT+=dt*(speed*1.7);
    }
    // world clamp
    player.x=Math.max(-44,Math.min(44,player.x));
    player.z=Math.max(-44,Math.min(44,player.z));
    var bob = moving ? Math.sin(bobT)*0.045 : 0;
    camera.position.set(player.x, EYE+bob, player.z);
    var e=new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(e);
  }

  /* ============================================================
     RECORDING (MediaRecorder on canvas stream)
     ============================================================ */
  var recorder=null, chunks=[];
  function toggleRecord(){
    if(recorder && recorder.state==='recording'){ recorder.stop(); return; }
    var stream = canvas.captureStream(30);
    var mime = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(function(m){return MediaRecorder.isTypeSupported(m);});
    if(!mime){ alert('Recording not supported in this browser.'); return; }
    chunks=[]; recorder=new MediaRecorder(stream,{mimeType:mime, videoBitsPerSecond:6000000});
    recorder.ondataavailable=function(e){ if(e.data.size) chunks.push(e.data); };
    recorder.onstop=function(){
      var blob=new Blob(chunks,{type:'video/webm'});
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a'); a.href=url; a.download='posada-rembrandt-tour.webm'; a.click();
      setTimeout(function(){URL.revokeObjectURL(url);},1000);
      document.getElementById('recBtn').classList.remove('is-on');
      document.getElementById('recLbl').textContent=tr('record');
      document.getElementById('recIndicator').hidden=true;
    };
    recorder.start();
    document.getElementById('recBtn').classList.add('is-on');
    document.getElementById('recLbl').textContent=tr('recording');
    document.getElementById('recIndicator').hidden=false;
  }

  /* ============================================================
     HUD WIRING + i18n apply
     ============================================================ */
  function applyLang(){
    document.documentElement.lang=LANG;
    document.getElementById('backLbl').textContent=tr('back');
    document.getElementById('hudSub').textContent=tr('sub');
    document.getElementById('autoLbl').textContent=autoMode?tr('autoStop'):tr('auto');
    document.getElementById('recLbl').textContent=(recorder&&recorder.state==='recording')?tr('recording'):tr('record');
    document.getElementById('langBtn').textContent=(LANG==='es')?'EN':'ES';
    document.getElementById('startBtnLbl').textContent=tr('enter');
    document.getElementById('startAutoLbl').textContent=autoMode?tr('autoStop'):tr('watch');
    document.getElementById('startLead').textContent=tr('lead');
    document.getElementById('loadingLbl').textContent=tr('building');
    document.getElementById('hintMove').textContent=tr('move');
    document.getElementById('hintLook').textContent=tr('look');
    document.getElementById('hintInspect').textContent=tr('doInspect');
    document.getElementById('hintRun').textContent=tr('run');
    // refresh open inspect panel
    if(!insEl.hidden && hovered && hovered.userData.info) openInspect(hovered.userData.info);
  }
  document.getElementById('langBtn').addEventListener('click', function(){
    LANG=(LANG==='es')?'en':'es'; localStorage.setItem('viaje_lang',LANG); applyLang();
  });
  document.getElementById('autoBtn').addEventListener('click', function(){ autoMode?stopAuto():startAuto(); });
  document.getElementById('recBtn').addEventListener('click', toggleRecord);

  var hintEl=document.getElementById('hudHint');
  var hintTimer=null;
  function hideHintSoon(){ clearTimeout(hintTimer); hintTimer=setTimeout(function(){hintEl.classList.add('is-hidden');},6000); }

  // start screen
  var startScreen=document.getElementById('startScreen');
  document.getElementById('startBtn').addEventListener('click', function(){
    startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650);
    requestLock(); hideHintSoon();
  });
  document.getElementById('startAuto').addEventListener('click', function(){
    startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650);
    startAuto();
  });

  /* ============================================================
     LOOP
     ============================================================ */
  var clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var dt=Math.min(clock.getDelta(),0.05);
    var time=clock.elapsedTime;
    if(autoMode){ updateAuto(dt,time); }
    else { updateManual(dt); updateHover(); }
    renderer.render(scene,camera);
  }

  window.addEventListener('resize', function(){
    camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  applyLang();
  document.getElementById('loading').classList.add('is-done');
  document.getElementById('crosshair').style.display='none';
  animate();

  /* deep-link: ?auto=1 launches the guided tour automatically (great for recording
     or embedding), ?play=1 drops straight into first-person. */
  (function(){
    var q=new URLSearchParams(location.search);
    if(q.get('auto')==='1'){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); startAuto(); }
    else if(q.get('play')==='1'){ startScreen.classList.add('is-hidden'); setTimeout(function(){startScreen.style.display='none';},650); hideHintSoon(); }
  })();
})();
