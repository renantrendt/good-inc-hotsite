#!/bin/bash

# Cria diretório de imagens se não existir
mkdir -p public/images

# Gera og-image.jpg (1200x630)
ffmpeg -i "https://www.youtube.com/watch?v=i5E3VC_hGB0" -ss 00:00:05 -vframes 1 -vf scale=1200:630 public/images/og-image.jpg

# Gera android-chrome-192x192.png
ffmpeg -i public/images/og-image.jpg -vf scale=192:192 public/android-chrome-192x192.png

# Gera android-chrome-512x512.png
ffmpeg -i public/images/og-image.jpg -vf scale=512:512 public/android-chrome-512x512.png

# Gera apple-touch-icon.png (180x180)
ffmpeg -i public/images/og-image.jpg -vf scale=180:180 public/apple-touch-icon.png

# Gera favicon.ico (32x32)
ffmpeg -i public/images/og-image.jpg -vf scale=32:32 public/favicon.ico
