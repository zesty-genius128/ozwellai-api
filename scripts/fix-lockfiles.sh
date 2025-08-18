#!/bin/bash
set -euo pipefail

# Fix package-lock.json sync issues
# This script regenerates lock files when they're out of sync with package.json

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔧 Fixing package-lock.json sync issues..."

# Fix spec lockfile
if [[ -d "$PROJECT_ROOT/spec" ]]; then
    echo "📦 Fixing spec package-lock.json..."
    cd "$PROJECT_ROOT/spec"
    if [[ -f "package-lock.json" ]]; then
        rm package-lock.json
        echo "  ✓ Removed old spec/package-lock.json"
    fi
    npm install
    echo "  ✓ Generated new spec/package-lock.json"
fi

# Fix reference server lockfile
if [[ -d "$PROJECT_ROOT/reference-server" ]]; then
    echo "📦 Fixing reference-server package-lock.json..."
    cd "$PROJECT_ROOT/reference-server"
    if [[ -f "package-lock.json" ]]; then
        rm package-lock.json
        echo "  ✓ Removed old reference-server/package-lock.json"
    fi
    npm install
    echo "  ✓ Generated new reference-server/package-lock.json"
fi

# Fix client lockfile
if [[ -d "$PROJECT_ROOT/clients/typescript" ]]; then
    echo "📦 Fixing client package-lock.json..."
    cd "$PROJECT_ROOT/clients/typescript"
    if [[ -f "package-lock.json" ]]; then
        rm package-lock.json
        echo "  ✓ Removed old clients/typescript/package-lock.json"
    fi
    npm install
    echo "  ✓ Generated new clients/typescript/package-lock.json"
fi

echo ""
echo "✅ Lock files regenerated successfully!"
echo ""
echo "You can now run:"
echo "  ./scripts/test-local.sh    # Test the complete workflow"
echo "  ./scripts/build-client.sh  # Build the client"
