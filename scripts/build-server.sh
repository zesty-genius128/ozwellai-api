#!/bin/bash
set -euo pipefail

# Build reference server
# This script can be run locally to test the build process

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVER_DIR="$PROJECT_ROOT/reference-server"

echo "🏗️  Building reference server..."
echo "📁 Working directory: $SERVER_DIR"

# Change to server directory
cd "$SERVER_DIR"

# Install dependencies with graceful lock file handling
if [[ -f "package-lock.json" ]] && npm ci --dry-run &>/dev/null; then
    echo "📦 Installing dependencies (using npm ci)..."
    npm ci
else
    echo "📦 Installing dependencies (using npm install)..."
    npm install
fi

# Run linting (with fix option)
echo "🔍 Running linter..."
if npm run lint:fix; then
    echo "  ✅ Linting passed"
else
    echo "  ⚠️  Linting issues found - attempting auto-fix..."
    npm run lint:fix || true
    echo "  ℹ️  Some linting issues may remain - continuing with build..."
fi

# Clean and build
echo "🧹 Cleaning previous build..."
npm run clean

echo "🔨 Building TypeScript..."
npm run build

# Verify build outputs exist
echo "✅ Verifying build outputs..."
required_files=(
    "dist/reference-server/src/server.js"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "  ✓ $file"
done

echo "🎉 Reference server build complete!"
echo ""
echo "To run the server:"
echo "  cd $SERVER_DIR"
echo "  npm start"
echo ""
echo "To run in development mode:"
echo "  cd $SERVER_DIR" 
echo "  npm run dev"
