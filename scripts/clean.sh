#!/bin/bash
set -euo pipefail

# Clean all build artifacts and temporary files
# Similar to "make clean" - removes generated files but keeps source code
# Usage: ./scripts/clean.sh [--deep]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEEP_CLEAN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --deep)
            DEEP_CLEAN=true
            shift
            ;;
        *)
            echo "Usage: $0 [--deep]"
            echo "  --deep  Also remove node_modules and package-lock.json"
            exit 1
            ;;
    esac
done

if [[ "$DEEP_CLEAN" == "true" ]]; then
    echo "🧹 Deep cleaning all build artifacts and dependencies..."
else
    echo "🧹 Cleaning build artifacts (use --deep for dependencies)..."
fi

# Clean TypeScript client
if [[ -d "$PROJECT_ROOT/clients/typescript" ]]; then
    echo "📦 Cleaning TypeScript client..."
    cd "$PROJECT_ROOT/clients/typescript"
    
    # Remove build outputs
    if [[ -d "dist" ]]; then
        rm -rf dist
        echo "  ✓ Removed dist/"
    fi
    
    # Remove node_modules if deep clean
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -d "node_modules" ]]; then
        rm -rf node_modules
        echo "  ✓ Removed node_modules/"
    fi
    
    # Remove npm logs
    if [[ -f "npm-debug.log" ]]; then
        rm -f npm-debug.log
        echo "  ✓ Removed npm-debug.log"
    fi
    
    # Remove package-lock if deep clean
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -f "package-lock.json" ]]; then
        rm -f package-lock.json
        echo "  ✓ Removed package-lock.json"
    fi
fi

# Clean spec directory
if [[ -d "$PROJECT_ROOT/spec" ]]; then
    echo "📋 Cleaning spec directory..."
    cd "$PROJECT_ROOT/spec"
    
    # Remove build outputs
    if [[ -d "dist" ]]; then
        rm -rf dist
        echo "  ✓ Removed spec/dist/"
    fi
    
    # Remove node_modules if deep clean
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -d "node_modules" ]]; then
        rm -rf node_modules
        echo "  ✓ Removed spec/node_modules/"
    fi
    
    # Remove package-lock if deep clean  
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -f "package-lock.json" ]]; then
        rm -f package-lock.json
        echo "  ✓ Removed spec/package-lock.json"
    fi
fi

# Clean reference server
if [[ -d "$PROJECT_ROOT/reference-server" ]]; then
    echo "🐳 Cleaning reference server..."
    cd "$PROJECT_ROOT/reference-server"
    
    # Remove build outputs
    if [[ -d "dist" ]]; then
        rm -rf dist
        echo "  ✓ Removed reference-server/dist/"
    fi
    
    # Remove node_modules if deep clean
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -d "node_modules" ]]; then
        rm -rf node_modules
        echo "  ✓ Removed reference-server/node_modules/"
    fi
    
    # Remove package-lock if deep clean  
    if [[ "$DEEP_CLEAN" == "true" ]] && [[ -f "package-lock.json" ]]; then
        rm -f package-lock.json
        echo "  ✓ Removed reference-server/package-lock.json"
    fi
    
    # Remove npm logs
    if [[ -f "npm-debug.log" ]]; then
        rm -f npm-debug.log
        echo "  ✓ Removed npm-debug.log"
    fi
    
    # Remove Docker build cache (optional)
    # docker builder prune -f 2>/dev/null || true
fi

# Clean root directory
cd "$PROJECT_ROOT"

# Remove common temporary files
find . -name "*.log" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true

# Remove TypeScript build info files
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo ""
echo "✅ Clean completed!"
echo ""
echo "To rebuild everything:"
echo "  ./scripts/build-client.sh     # Build TypeScript client"
echo "  ./scripts/build-server.sh     # Build reference server"
echo "  ./scripts/test-local.sh       # Test complete workflow"
