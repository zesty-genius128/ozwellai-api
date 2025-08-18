#!/bin/bash
set -euo pipefail

# Test TypeScript client with Deno
# This script can be run locally or in CI

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/clients/typescript"

echo "🦕 Testing TypeScript client with Deno..."
echo "📁 Working directory: $CLIENT_DIR"

# Change to client directory
cd "$CLIENT_DIR"

# Run Deno tests
echo "🧪 Running Deno tests..."
deno test --config deno.json --allow-net test/**/*.deno.test.ts

echo "✅ Deno tests completed successfully!"
