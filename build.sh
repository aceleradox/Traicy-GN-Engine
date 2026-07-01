#!/bin/sh
# Compilador básico para Sprite Easy

if [ -z "$1" ]; then
  echo "Uso: ./build.sh <target>"
  echo "Targets: desktop android web poki abacato"
  exit 1
fi

target="$1"

case "$target" in
  desktop|android|web|poki)
    out="dist/$target"
    mkdir -p "$out"
    cp -r game.html css js resource data abacato.js sub-script.json "$out"
    if [ "$target" = "web" ] || [ "$target" = "poki" ]; then
      cp game.html "$out/index.html"
    fi
    echo "Build para $target pronto em $out"
    ;;
  abacato)
    out="dist/abacato-backend"
    mkdir -p "$out"
    cp abacato.js criar-backend.yml sub-script.json sub-script-vibe-code.yml sub-sprite-vibe-code.yml sub-sound-vibe-code.yml sub-maps-vibe-code.yml sub-scene-vibe-code.yml sub-grapix-vibe-code.yml "$out"
    echo "Build backend Abacato pronto em $out"
    ;;
  *)
    echo "Target desconhecido: $target"
    exit 1
    ;;
esac
