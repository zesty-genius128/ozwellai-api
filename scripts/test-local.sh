#!/bin/bash
set -euo pipefail

# Test build locally without publishing
# This demonstrates the script-first approach - you can run the exact same build process locally

echo "🧪 Testing local build process..."
echo ""

# Test version extraction
echo "1️⃣  Testing version extraction:"
./scripts/extract-version.sh v1.0.0
echo ""

# Test client build
echo "2️⃣  Testing client build:"
./scripts/build-client.sh
echo ""

# Test publish preparation (dry run)
echo "3️⃣  Testing publish preparation (dry run):"
DRY_RUN=true ./scripts/publish-client.sh 1.0.0
echo ""

echo "🎉 All local tests passed!"
echo ""
echo "To actually publish:"
echo "  1. Create a git tag: git tag v1.0.0 && git push origin v1.0.0"
echo "  2. Create a GitHub release (this will trigger automatic publishing)"
echo "  3. Or publish manually: ./scripts/publish-client.sh 1.0.0"
