"""Generate the Drawnix brand assets into apps/web/public/brand.

Run:  python3 scripts/build-brand.py
Requires rsvg-convert (brew install librsvg) for the PNG/ICO output.
"""
import os, re, struct, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------- minimal SVG path bbox ----------
import math

NUM = re.compile(r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
CMD = re.compile(r'[MmLlHhVvCcSsQqTtAaZz]')

def tokens(d):
    i = 0
    while i < len(d):
        ch = d[i]
        if CMD.match(ch):
            yield ch; i += 1
        elif ch in ' ,\t\n\r':
            i += 1
        else:
            m = NUM.match(d, i)
            if not m: raise ValueError(f'bad char {ch!r} at {i}')
            yield float(m.group()); i = m.end()

def arc_points(x0, y0, rx, ry, phi, large, sweep, x, y, n=24):
    if rx == 0 or ry == 0: return [(x, y)]
    phi = math.radians(phi)
    dx2, dy2 = (x0 - x) / 2.0, (y0 - y) / 2.0
    x1 =  math.cos(phi) * dx2 + math.sin(phi) * dy2
    y1 = -math.sin(phi) * dx2 + math.cos(phi) * dy2
    rx, ry = abs(rx), abs(ry)
    lam = x1*x1/(rx*rx) + y1*y1/(ry*ry)
    if lam > 1: k = math.sqrt(lam); rx *= k; ry *= k
    num = rx*rx*ry*ry - rx*rx*y1*y1 - ry*ry*x1*x1
    den = rx*rx*y1*y1 + ry*ry*x1*x1
    co = math.sqrt(max(num/den, 0))
    if large == sweep: co = -co
    cx1, cy1 = co * rx * y1 / ry, -co * ry * x1 / rx
    cx = math.cos(phi)*cx1 - math.sin(phi)*cy1 + (x0 + x)/2
    cy = math.sin(phi)*cx1 + math.cos(phi)*cy1 + (y0 + y)/2
    def ang(ux, uy, vx, vy):
        d = (ux*vx + uy*vy) / (math.hypot(ux,uy)*math.hypot(vx,vy))
        a = math.acos(max(-1, min(1, d)))
        return -a if ux*vy - uy*vx < 0 else a
    th1 = ang(1, 0, (x1-cx1)/rx, (y1-cy1)/ry)
    dth = ang((x1-cx1)/rx, (y1-cy1)/ry, (-x1-cx1)/rx, (-y1-cy1)/ry)
    if not sweep and dth > 0: dth -= 2*math.pi
    if sweep and dth < 0: dth += 2*math.pi
    pts = []
    for i in range(1, n+1):
        t = th1 + dth*i/n
        pts.append((cx + rx*math.cos(t)*math.cos(phi) - ry*math.sin(t)*math.sin(phi),
                    cy + rx*math.cos(t)*math.sin(phi) + ry*math.sin(t)*math.cos(phi)))
    return pts

def cubic(p0, p1, p2, p3, n=24):
    out = []
    for i in range(1, n+1):
        t = i/n; u = 1-t
        out.append((u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
                    u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]))
    return out

def path_points(d):
    ts = list(tokens(d))
    i = 0; cur = (0.0, 0.0); start = (0.0, 0.0); prev_c2 = None; prev_q = None; cmd = None
    pts = []
    def take(k):
        nonlocal i
        vals = ts[i:i+k]; i += k; return vals
    while i < len(ts):
        if isinstance(ts[i], str):
            cmd = ts[i]; i += 1
        c = cmd; rel = c.islower(); C = c.upper()
        if C == 'Z':
            cur = start; pts.append(cur); prev_c2 = None; continue
        if C == 'M':
            x, y = take(2)
            cur = (cur[0]+x, cur[1]+y) if rel else (x, y)
            start = cur; pts.append(cur); prev_c2 = None
            cmd = 'l' if rel else 'L'
        elif C == 'L':
            x, y = take(2)
            cur = (cur[0]+x, cur[1]+y) if rel else (x, y); pts.append(cur); prev_c2 = None
        elif C == 'H':
            x, = take(1); cur = (cur[0]+x, cur[1]) if rel else (x, cur[1]); pts.append(cur); prev_c2 = None
        elif C == 'V':
            y, = take(1); cur = (cur[0], cur[1]+y) if rel else (cur[0], y); pts.append(cur); prev_c2 = None
        elif C == 'C':
            x1,y1,x2,y2,x,y = take(6)
            if rel: x1+=cur[0]; y1+=cur[1]; x2+=cur[0]; y2+=cur[1]; x+=cur[0]; y+=cur[1]
            pts += cubic(cur,(x1,y1),(x2,y2),(x,y)); prev_c2=(x2,y2); cur=(x,y)
        elif C == 'S':
            x2,y2,x,y = take(4)
            if rel: x2+=cur[0]; y2+=cur[1]; x+=cur[0]; y+=cur[1]
            c1 = (2*cur[0]-prev_c2[0], 2*cur[1]-prev_c2[1]) if prev_c2 else cur
            pts += cubic(cur,c1,(x2,y2),(x,y)); prev_c2=(x2,y2); cur=(x,y)
        elif C == 'Q':
            x1,y1,x,y = take(4)
            if rel: x1+=cur[0]; y1+=cur[1]; x+=cur[0]; y+=cur[1]
            c1 = (cur[0]+2/3*(x1-cur[0]), cur[1]+2/3*(y1-cur[1]))
            c2 = (x+2/3*(x1-x), y+2/3*(y1-y))
            pts += cubic(cur,c1,c2,(x,y)); prev_q=(x1,y1); cur=(x,y); prev_c2=None
        elif C == 'T':
            x,y = take(2)
            if rel: x+=cur[0]; y+=cur[1]
            q = (2*cur[0]-prev_q[0], 2*cur[1]-prev_q[1]) if prev_q else cur
            c1 = (cur[0]+2/3*(q[0]-cur[0]), cur[1]+2/3*(q[1]-cur[1]))
            c2 = (x+2/3*(q[0]-x), y+2/3*(q[1]-y))
            pts += cubic(cur,c1,c2,(x,y)); prev_q=q; cur=(x,y); prev_c2=None
        elif C == 'A':
            rx,ry,rot,la,sw,x,y = take(7)
            if rel: x+=cur[0]; y+=cur[1]
            pts += arc_points(cur[0],cur[1],rx,ry,rot,int(la),int(sw),x,y); cur=(x,y); prev_c2=None
        else:
            raise ValueError('unsupported command ' + c)
    return pts

def bbox(ds):
    xs=[]; ys=[]
    for d in ds:
        for x,y in path_points(d): xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


OUT  = os.path.join(REPO, 'apps/web/public/brand')
os.makedirs(OUT, exist_ok=True)

MARK = ("M5 19 C-1 31 5 44 15 48 C23 51 29 50 34 44 C39 34 46 20 57 3 L51 45 "
        "C56 46 60 48 64 51 C55 52 48 51 43 49 C45 56 44 62 43 68 C40 60 37 56 32 54 "
        "C22 52 10 46 6 37 C2 30 2 23 5 19 Z")
TILE = ("M14 0 H50 A14 14 0 0 1 64 14 V50 A14 14 0 0 1 50 64 H14 "
        "A14 14 0 0 1 0 50 V14 A14 14 0 0 1 14 0 Z")

# ---------- palette : 朱 · 墨 · 纸 ----------
# Flat, one hue, no gradient, and one value for every ground. A gradient dates a
# mark to the decade it was drawn in; a single pigment does not. 朱膘 is the mix
# that holds up on both ends: measured as a 16px icon it scores 3.31 against a
# light tab strip, 3.31 against a dark one and 4.05 against a dark dock — its
# worst ground is 3.10, where 银朱 #C0362C bottoms out at 2.45. Trading a step of
# headroom on light ground buys away the whole light/dark switching rule.
ZHU = '#D8452F'           # 朱膘，全场唯一的红
INK = '#1A1512'           # 暖墨，与朱同族的中性黑
PAPER = '#F7F3EC'         # 宣纸白，反刻笔画与深底字标
PAD = 2                   # mark artboard padding, in mark units

mx0, my0, mx1, my1 = bbox([MARK])
MW, MH = mx1 - mx0, my1 - my0
MCX, MCY = (mx0 + mx1) / 2, (my0 + my1) / 2

def svg(vb, body, defs='', w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ''
    d = f'<defs>{defs}</defs>' if defs else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size}>'
            f'{d}{body}</svg>\n')

def write(name, text):
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(text)
    return name

# ---------- form A : free mark ----------
vbA = f'{mx0-PAD:.3f} {my0-PAD:.3f} {MW+PAD*2:.3f} {MH+PAD*2:.3f}'
write('mark.svg',      svg(vbA, f'<path fill="{ZHU}" d="{MARK}"/>'))
write('mark-mono.svg', svg(vbA, f'<path fill="currentColor" d="{MARK}"/>'))

# ---------- form B : icon ----------
def tile(scale, fill=ZHU, knock=PAPER, bleed=False):
    """bleed=True gives a full-square plate: maskable and apple-touch icons must
    reach the edges with no transparency, since the platform applies its own mask."""
    tx, ty = 32 - MCX * scale, 32 - MCY * scale
    plate = f'<rect width="64" height="64" fill="{fill}"/>' if bleed else f'<path fill="{fill}" d="{TILE}"/>'
    return (plate +
            f'<path fill="{knock}" transform="translate({tx:.3f},{ty:.3f}) scale({scale})" d="{MARK}"/>')

write('icon.svg',          svg('0 0 64 64', tile(0.74)))
write('icon-square.svg',   svg('0 0 64 64', tile(0.68, bleed=True)))
write('icon-maskable.svg', svg('0 0 64 64', tile(0.615, bleed=True)))
write('icon-solid.svg',    svg('0 0 64 64', tile(0.74, fill=INK)))   # 墨底，单色印刷与深色场备用

# ---------- browser favicon : form A, no plate ----------
# The tab strip is the one icon slot with no platform mask and no neighbours to
# line up with, so the mark can drop the colour field and fill the box by its
# longest side — 0.98 against form B's 0.74, which makes the shape itself bigger
# than the knocked-out one. One value covers both strips, so no media query.
FAV_S = 0.98 * 64 / max(MW, MH)
fav_tx, fav_ty = 32 - MCX * FAV_S, 32 - MCY * FAV_S
FAV = svg('0 0 64 64', f'<path fill="{ZHU}" transform="translate({fav_tx:.3f},'
          f'{fav_ty:.3f}) scale({FAV_S:.4f})" d="{MARK}"/>')
write('favicon.svg', FAV)
write('favicon-src.svg', FAV)      # scratch, for the .ico raster

# ---------- lockups ----------
src = open(os.path.join(REPO, 'apps/web/public/logo/logo_drawnix_h.svg')).read()
letters = [m.group(1) for m in re.finditer(r"<path class=\"cls-1\"[^>]*d=\"([^\"]+)\"", src)]
wx0, wy0, wx1, wy1 = bbox(letters)
cy0, cy1 = bbox([letters[0]])[1], bbox([letters[0]])[3]     # cap height from the D
CAP = cy1 - cy0
CAP_MID = (cy0 + cy1) / 2

MARK_H = CAP * 1.62
S      = MARK_H / MH
GAP    = CAP * 0.36        # mark-to-wordmark. 0.26 measured 0.29 cap at the
                           # closest approach, and that approach is the right
                           # tail tine pointing straight at the D's stem — a
                           # point aimed at a flat wall reads tighter than it is
LPAD   = CAP * 0.06        # lockup bleed: without it the x and the blade tip sit
                           # exactly on the viewBox edge and get shaved by any
                           # container that clips or rounds

mark_w  = MW * S
word_x  = mark_w + GAP
total_w = word_x + (wx1 - wx0)
total_h = MARK_H

mtx = -mx0 * S
mty = 0 - my0 * S
wtx = word_x - wx0
wty = (MARK_H / 2) - CAP_MID

def lockup(word_fill, mark_fill, defs=''):
    return svg(f'{-LPAD:.2f} {-LPAD:.2f} {total_w+2*LPAD:.2f} {total_h+2*LPAD:.2f}',
               f'<g transform="translate({mtx:.3f},{mty:.3f}) scale({S:.5f})">'
               f'<path fill="{mark_fill}" d="{MARK}"/></g>'
               f'<g transform="translate({wtx:.3f},{wty:.3f})" fill="{word_fill}">'
               + ''.join(f'<path d="{d}"/>' for d in letters) + '</g>', defs)

write('logo-h.svg',      lockup(INK,   ZHU))
write('logo-h-dark.svg', lockup(PAPER, ZHU))
write('logo-h-mono.svg', lockup('currentColor', 'currentColor', ''))


# ---------- vertical lockup ----------
VS      = (CAP * 2.15) / MH
v_markw = MW * VS
v_markh = MH * VS
v_gap   = CAP * 0.46
v_wordw = wx1 - wx0
v_w     = max(v_markw, v_wordw)
v_h     = v_markh + v_gap + (wy1 - wy0)

def lockup_v(word_fill, mark_fill, defs=''):
    mtx_v = (v_w - v_markw) / 2 - mx0 * VS
    mty_v = -my0 * VS
    wtx_v = (v_w - v_wordw) / 2 - wx0
    wty_v = v_markh + v_gap - wy0
    return svg(f'{-LPAD:.2f} {-LPAD:.2f} {v_w+2*LPAD:.2f} {v_h+2*LPAD:.2f}',
               f'<g transform="translate({mtx_v:.3f},{mty_v:.3f}) scale({VS:.5f})">'
               f'<path fill="{mark_fill}" d="{MARK}"/></g>'
               f'<g transform="translate({wtx_v:.3f},{wty_v:.3f})" fill="{word_fill}">'
               + ''.join(f'<path d="{d}"/>' for d in letters) + '</g>', defs)

write('logo-v.svg',      lockup_v(INK,   ZHU))
write('logo-v-dark.svg', lockup_v(PAPER, ZHU))

# ---------- OG image ----------
og_w, og_h = 1200, 630
og_s = 0.62
og_lw, og_lh = total_w * og_s, total_h * og_s
og_body = (
    f'<rect width="{og_w}" height="{og_h}" fill="{PAPER}"/>'
    f'<rect width="{og_w}" height="{og_h}" fill="url(#dots)"/>'
    f'<g transform="translate({(og_w-og_lw)/2:.1f},{og_h/2-og_lh/2-26:.1f}) scale({og_s})">'
    f'<g transform="translate({mtx:.3f},{mty:.3f}) scale({S:.5f})"><path fill="{ZHU}" d="{MARK}"/></g>'
    f'<g transform="translate({wtx:.3f},{wty:.3f})" fill="{INK}">'
    + ''.join(f'<path d="{d}"/>' for d in letters) + '</g></g>'
    f'<text x="{og_w/2}" y="{og_h/2+72}" text-anchor="middle" font-size="27" fill="#6B6058" '
    f'font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, system-ui, sans-serif">'
    f'开源白板工具 · 思维导图 · 流程图 · 自由画</text>'
)
og_defs = ('<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">'
           '<circle cx="1.5" cy="1.5" r="1.5" fill="#E0D8CB"/></pattern>')
write('og.svg', svg(f'0 0 {og_w} {og_h}', og_body, og_defs, og_w, og_h))

# ---------- rasterise ----------
def png(src_svg, out_png, w, h=None):
    cmd = ['rsvg-convert', '-w', str(w), '-h', str(h or w), os.path.join(OUT, src_svg),
           '-o', os.path.join(OUT, out_png)]
    subprocess.run(cmd, check=True)
    return out_png

for size in (16, 32, 48, 64):
    png('favicon-src.svg', f'favicon-{size}.png', size)
png('icon-square.svg', 'apple-touch-icon.png', 180)
png('icon.svg', 'icon-192.png', 192)
png('icon.svg', 'icon-512.png', 512)
png('icon-maskable.svg', 'icon-maskable-512.png', 512)
png('og.svg', 'og.png', 1200, 630)

# ---------- favicon.ico ----------
sizes = [16, 32, 48]
blobs = [open(os.path.join(OUT, f'favicon-{s}.png'), 'rb').read() for s in sizes]
header = struct.pack('<HHH', 0, 1, len(sizes))
offset = 6 + 16 * len(sizes)
entries, data = b'', b''
for s, blob in zip(sizes, blobs):
    entries += struct.pack('<BBBBHHII', s, s, 0, 0, 1, 32, len(blob), offset)
    offset += len(blob)
    data += blob
with open(os.path.join(OUT, 'favicon.ico'), 'wb') as f:
    f.write(header + entries + data)
os.remove(os.path.join(OUT, 'favicon-src.svg'))   # scratch: only the .ico needs it

print('mark bbox  %.3f %.3f %.3f %.3f' % (mx0, my0, mx1, my1))
print('cap height %.2f  mark height %.2f  scale %.4f' % (CAP, MARK_H, S))
print('lockup     %.2f x %.2f' % (total_w, total_h))
print('files:', ', '.join(sorted(os.listdir(OUT))))
