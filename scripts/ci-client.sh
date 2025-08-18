#!/bin/bash
set -euo pipefail

# Build and test TypeScript client for CI
# This script handles the complete CI process including spec building

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SPEC_DIR="$PROJECT_ROOT/spec"
CLIENT_DIR="$PROJECT_ROOT/clients/typescript"

echo "🏗️  Running TypeScript client CI..."

# Build spec first
echo "📦 Building spec..."
cd "$SPEC_DIR"
if [[ ! -d "node_modules" ]]; then
    echo "Installing spec dependencies..."
    npm ci
fi
npm run build

# Build and test client
echo "📦 Building and testing client..."
cd "$CLIENT_DIR"
if [[ ! -d "node_modules" ]]; then
    echo "Installing client dependencies..."
    npm ci
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build client
echo "🔨 Building client..."
npm run build

# Run Node.js tests
echo "🧪 Running Node.js tests..."
npm run test:node

echo "✅ CI completed successfully!"
