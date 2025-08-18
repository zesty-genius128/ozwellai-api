#!/bin/bash
set -euo pipefail

# Publish TypeScript client to npm and JSR
# Usage: ./scripts/publish-client.sh [version]
# Example: ./scripts/publish-client.sh 1.2.3

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/clients/typescript"

# Extract version from command line or environment
VERSION=${1:-${VERSION:-""}}

if [[ -z "$VERSION" ]]; then
    echo "❌ Error: No version specified"
    echo "Usage: $0 [version]"
    echo "Example: $0 1.2.3"
    echo "Or set VERSION environment variable"
    exit 1
fi

# Validate version format
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$ ]]; then
    echo "❌ Error: '$VERSION' is not a valid semantic version"
    echo "Valid formats: 1.0.0, 1.0.0-beta.1, 1.0.0-rc.1+build.123"
    exit 1
fi

echo "📦 Publishing TypeScript client version $VERSION"
echo "📁 Working directory: $CLIENT_DIR"

# Change to client directory
cd "$CLIENT_DIR"

# Update package.json version
echo "📝 Updating package.json version to $VERSION..."
# Only update if version is different
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != "$VERSION" ]]; then
    npm version "$VERSION" --no-git-tag-version
else
    echo "Version $VERSION already set in package.json"
fi

# Update jsr.json version (if it exists)
if [[ -f "jsr.json" ]]; then
    echo "📝 Updating jsr.json version to $VERSION..."
    # Use a simple sed replacement for jsr.json
    sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" jsr.json
    rm -f jsr.json.bak
fi

# Build the package
echo "🏗️  Building package..."
"$SCRIPT_DIR/build-client.sh"

# Check if we should actually publish or just prepare
if [[ "${DRY_RUN:-false}" == "true" ]]; then
    echo "🚧 DRY_RUN mode - skipping actual publishing"
    echo "Would publish:"
    echo "  • npm: ozwellai@$VERSION"
    echo "  • JSR: @mieweb/ozwellai@$VERSION"
    exit 0
fi

# Check npm authentication
if [[ -z "${NPM_TOKEN:-}" ]] && ! npm whoami >/dev/null 2>&1; then
    echo "❌ Error: Not authenticated with npm"
    echo "Either set NPM_TOKEN environment variable or run 'npm login'"
    exit 1
fi

# Publish to npm
echo "🚀 Publishing to npm..."
if [[ -n "${NPM_TOKEN:-}" ]]; then
    # Use token-based auth (for CI)
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
fi

npm publish --access public

echo "✅ Published to npm: ozwellai@$VERSION"

# Publish to JSR (if jsr.json exists and JSR is available)
if [[ -f "jsr.json" ]] && (command -v jsr >/dev/null 2>&1 || command -v npx >/dev/null 2>&1); then
    echo "🚀 Publishing to JSR..."
    if command -v jsr >/dev/null 2>&1; then
        jsr publish
    else
        npx jsr publish
    fi
    echo "✅ Published to JSR: @mieweb/ozwellai@$VERSION"
elif [[ -f "jsr.json" ]]; then
    echo "⚠️  jsr.json found but JSR CLI not available"
    echo "To publish to JSR, install: npm install jsr"
fi

echo ""
echo "🎉 Publishing completed successfully!"
echo "📦 Version $VERSION is now available:"
echo "  • npm: https://www.npmjs.com/package/ozwellai"
if [[ -f "jsr.json" ]]; then
    echo "  • JSR: https://jsr.io/@mieweb/ozwellai"
fi
