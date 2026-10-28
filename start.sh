#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "Installing Next.js dependencies with Bun..."
    bun install
fi

echo "=========================================================="
echo " Starting feConvert-MP3 (Next.js 14)..."
echo " Access locally  : http://localhost:3000"
echo " Access from phone: http://192.168.1.35:3000"
echo "=========================================================="

bun run dev
