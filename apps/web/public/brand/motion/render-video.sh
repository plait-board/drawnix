#!/usr/bin/env sh
# Drawnix 6s brand sequence — encode the frame series.
# Needs ffmpeg:  brew install ffmpeg
set -e
FPS=30
for A in 1x1 9x16 16x9; do
  # H.264 mp4 — the universal social upload
  ffmpeg -y -framerate $FPS -i "$A/f%04d.png" \
    -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "drawnix-$A.mp4"

  # VP9 webm with alpha — for overlaying on a site or a deck
  ffmpeg -y -framerate $FPS -i "$A/f%04d.png" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 "drawnix-$A.webm"
done

# a short looping GIF for chat and issue threads (1:1 only, 15fps, 480px)
ffmpeg -y -framerate 30 -i 1x1/f%04d.png -vf \
  "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse" \
  -loop 0 drawnix-1x1.gif
