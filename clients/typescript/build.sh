#!/bin/bash
set -e

echo "🏗️  Building OzwellAI TypeScript Client..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Build all variants
echo "📦 Building ESM..."
npx tsc -p tsconfig.esm.json

echo "📦 Building CommonJS..."
npx tsc -p tsconfig.cjs.json
echo '{"type":"commonjs"}' > dist/cjs/package.json

echo "📦 Building type definitions..."
npx tsc -p tsconfig.types.json

echo "✅ Build complete!"
echo "📁 Output in dist/:"
echo "   - dist/esm/     (ES Modules)"
echo "   - dist/cjs/     (CommonJS)" 
echo "   - dist/types/   (TypeScript definitions)"
