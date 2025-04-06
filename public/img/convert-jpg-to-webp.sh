#!/bin/bash
for img in *.jp*g; do
  out="${img%.*}.webp"
  if cwebp -q 80 "$img" -o "$out"; then
    rm "$img"
  else
    echo "Failed to convert $img"
  fi
done

