#!/bin/bash

# Gera android-chrome-192x192.png
convert public/images/products/treatment-pre.jpeg -resize 192x192 public/android-chrome-192x192.png

# Gera android-chrome-512x512.png
convert public/images/products/treatment-pre.jpeg -resize 512x512 public/android-chrome-512x512.png

# Gera apple-touch-icon.png (180x180)
convert public/images/products/treatment-pre.jpeg -resize 180x180 public/apple-touch-icon.png

# Gera favicon.ico (32x32)
convert public/images/products/treatment-pre.jpeg -resize 32x32 public/favicon.ico
