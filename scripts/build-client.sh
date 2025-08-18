#!/bin/bash
set -euo pipefail

# Build TypeScript client for npm and JSR publishing
# This script can be run locally to test the build process

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/clients/typescript"

echo "🏗️  Building TypeScript client..."
echo "📁 Working directory: $CLIENT_DIR"

# Change to client directory
cd "$CLIENT_DIR"

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Clean and build
echo "🧹 Cleaning previous build..."
npm run clean

echo "🔨 Building ESM, CJS, and type definitions..."
npm run build

# Verify build outputs exist
echo "✅ Verifying build outputs..."
required_files=(
    "dist/esm/index.js"
    "dist/cjs/index.js" 
    "dist/cjs/package.json"
    "dist/types/index.d.ts"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "  ✓ $file"
done

# Run tests
echo "🧪 Running tests..."
echo "  📦 Testing Node.js compatibility..."
npm run test:node

echo "  🦕 Testing Deno compatibility..."
cd "$PROJECT_ROOT"
./scripts/test-deno.sh
cd "$CLIENT_DIR"

echo "✅ Build completed successfully!"
echo "📦 Package ready for publishing from: $CLIENT_DIR"
echo ""
echo "Next steps:"
echo "  • npm publish (for npm)"
echo "  • npx jsr publish (for JSR)"
