# -*- coding: utf-8 -*-
"""Genera UN SOLO PNG con los QR de la feria: videoblog destacado + 4 estaciones."""
import os
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from PIL import Image, ImageDraw, ImageFont

BASE = "https://ejercitopalomazi9111-arch.github.io/viaje-guanajuato/"

FEATURE = ("VIDEOBLOG · ≈10 MIN", "Videoblog del Viaje",
           "Crónica en video de la expedición a Guanajuato", "videoblog.html")

ITEMS = [
    ("MAQUETA · INICIO",   "Mina La Valenciana",  "Maqueta física · vista orbital", "feria.html?stop=mina",   True),
    ("MAQUETA · FINAL",    "Monumento al Pípila", "Maqueta física · vista orbital", "feria.html?stop=pipila", True),
    ("ESTACIÓN",           "El Jardín",           "Hierbas regadas con el lavabo",  "jardin.html",            False),
    ("RECORRIDO COMPLETO", "Mapa interactivo",    "Las 13 paradas del viaje",       "index.html",             False),
]

# ---- Colores (negro / dorado / crema editorial) ----
BG, CARD = (20, 17, 13), (251, 247, 239)
GOLD, GOLD_D = (199, 154, 62), (154, 111, 30)
INK, MUTED, QRDARK = (36, 26, 20), (107, 92, 80), (28, 23, 18)

def font(p, s):
    try: return ImageFont.truetype(p, s)
    except Exception: return ImageFont.load_default()

F_TITLE = font("C:/Windows/Fonts/georgiab.ttf", 82)
F_FEAT  = font("C:/Windows/Fonts/georgiab.ttf", 58)
F_H1    = font("C:/Windows/Fonts/georgiab.ttf", 38)
F_EYE   = font("C:/Windows/Fonts/consola.ttf", 24)
F_TAG   = font("C:/Windows/Fonts/consolab.ttf", 20)
F_SUB   = font("C:/Windows/Fonts/segoeui.ttf", 24)
F_SCAN  = font("C:/Windows/Fonts/seguisb.ttf", 24)
F_URL   = font("C:/Windows/Fonts/consola.ttf", 17)
F_FOOT  = font("C:/Windows/Fonts/segoeui.ttf", 22)

def qr_img(data, px):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=10, border=2)
    qr.add_data(data); qr.make(fit=True)
    return qr.make_image(fill_color=QRDARK, back_color=CARD).convert("RGB").resize((px, px), Image.NEAREST)

def center(d, txt, f, cx, y, fill):
    d.text((cx - d.textlength(txt, font=f)/2, y), txt, font=f, fill=fill)

W, H = 1500, 2420
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# Marco dorado esquinado
m = 34
d.rectangle([m, m, W-m, H-m], outline=GOLD, width=2)
for (x, y, dx, dy) in [(m,m,1,1),(W-m,m,-1,1),(m,H-m,1,-1),(W-m,H-m,-1,-1)]:
    d.line([(x, y), (x+dx*70, y)], fill=GOLD, width=6)
    d.line([(x, y), (x, y+dy*70)], fill=GOLD, width=6)

# Logo institucional (escudo Rembrandt)
try:
    logo = Image.open("C:/Users/ejerc/OneDrive/Desktop/Proyectos/Viaje Guanajuato Feria/assets/img/logo_rembrandt.png").convert("RGBA")
    lh = 132
    lw = int(logo.width * lh / logo.height)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    img.paste(logo, (int(W/2 - lw/2), 60), logo)
except Exception as e:
    print("logo:", e)

# Encabezado
center(d, "INSTITUTO REMBRANDT · FERIA DE CIENCIAS", F_EYE, W/2, 212, GOLD)
center(d, "Códigos QR del Recorrido", F_TITLE, W/2, 252, CARD)
center(d, "Abre esta imagen en la laptop y escanea cada código con la cámara del celular.", F_SUB, W/2, 364, MUTED)

margin = 90

# ---- Tarjeta DESTACADA: Videoblog (ancho completo) ----
fx, fy, fw, fh = margin, 446, W - 2*margin, 460
d.rounded_rectangle([fx, fy, fx+fw, fy+fh], radius=26, fill=CARD)
d.rounded_rectangle([fx, fy, fx+fw, fy+fh], radius=26, outline=GOLD, width=5)
fq = 360
img.paste(qr_img(BASE + FEATURE[3], fq), (fx+46, fy + (fh-fq)//2))
tx = fx + 46 + fq + 56
d.text((tx, fy+70),  FEATURE[0], font=F_TAG,  fill=GOLD_D)
d.text((tx, fy+104), FEATURE[1], font=F_FEAT, fill=INK)
d.text((tx, fy+196), FEATURE[2], font=F_SUB,  fill=MUTED)
d.text((tx, fy+252), "▣  Escanea con la cámara para verlo", font=F_SCAN, fill=GOLD_D)
d.text((tx, fy+300), (BASE + FEATURE[3]).replace("https://", ""), font=F_URL, fill=(169,158,143))

# ---- Rejilla 2x2: estaciones ----
gap = 56
card_w = (W - 2*margin - gap) // 2
card_h = 632
top = fy + fh + gap
qr_px = 380

for i, (tag, title, sub, path, is_model) in enumerate(ITEMS):
    col, row = i % 2, i // 2
    x = margin + col * (card_w + gap)
    y = top + row * (card_h + gap)
    d.rounded_rectangle([x, y, x+card_w, y+card_h], radius=24, fill=CARD)
    if is_model:
        d.rounded_rectangle([x, y, x+card_w, y+card_h], radius=24, outline=GOLD, width=4)
    cx = x + card_w/2
    center(d, tag, F_TAG, cx, y+26, GOLD_D)
    img.paste(qr_img(BASE + path, qr_px), (int(cx - qr_px/2), y+62))
    qy = y + 62 + qr_px
    center(d, title, F_H1, cx, qy+12, INK)
    center(d, sub, F_SUB, cx, qy+60, MUTED)
    center(d, "▣  Escanea con la cámara", F_SCAN, cx, qy+96, GOLD_D)
    center(d, (BASE + path).replace("https://", ""), F_URL, cx, qy+136, (169,158,143))

center(d, "Una sola hoja · 1 videoblog + 4 estaciones · " + BASE.replace("https://", ""), F_FOOT, W/2, H-86, MUTED)

out1 = r"C:\Users\ejerc\OneDrive\Desktop\Proyectos\Viaje Guanajuato Feria\qr\QR-Feria-de-Ciencias.png"
out2 = r"C:\Users\ejerc\OneDrive\Desktop\QR Feria de Ciencias.png"
os.makedirs(os.path.dirname(out1), exist_ok=True)
img.save(out1); img.save(out2)
print("OK ->", out1)
print("OK ->", out2)
