#!/bin/bash
set -euo pipefail

# Extract and validate version from git tag
# This script can be run locally to test the version extraction logic

# Default to provided tag or current git tag
TAG_REF=${1:-${GITHUB_REF:-$(git describe --tags --exact-match 2>/dev/null || echo "")}}

if [[ -z "$TAG_REF" ]]; then
    echo "Error: No tag provided and no exact tag found for current commit"
    echo "Usage: $0 [tag]"
    echo "Example: $0 v1.0.0"
    exit 1
fi

# Extract version from tag (remove refs/tags/ prefix if present)
VERSION=${TAG_REF#refs/tags/}

echo "Processing tag: $VERSION"

# Validate that the tag looks like a version (v1.0.0 or 1.0.0)
if [[ ! $VERSION =~ ^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$ ]]; then
    echo "Error: Tag '$VERSION' is not a valid semantic version"
    echo "Valid formats: v1.0.0, 1.0.0, v1.0.0-beta.1, v1.0.0-rc.1+build.123"
    exit 1
fi

# Remove 'v' prefix if present for Docker tagging
CLEAN_VERSION=${VERSION#v}

echo "✅ Valid semantic version detected"
echo "Original tag: $VERSION"
echo "Clean version: $CLEAN_VERSION" 

# Output for GitHub Actions (if running in CI)
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "version=$CLEAN_VERSION" >> "$GITHUB_OUTPUT"
    echo "original_tag=$VERSION" >> "$GITHUB_OUTPUT"
fi

echo "Publishing version: $CLEAN_VERSION"
