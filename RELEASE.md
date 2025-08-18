# Release Process

This document explains how to release new versions of the OzwellAI TypeScript client.

## Overview

The TypeScript client uses a tag-based release process with automatic publishing to both npm and JSR. This provides:

- **Explicit "go" button**: Only publish when you create a release
- **Immutable provenance**: Each release is tied to a specific git tag
- **Fewer accidental publishes**: No automatic publishing on every main branch push
- **Version consistency**: Version numbers are extracted from git tags

## Release Steps

### 1. Prepare for Release

Make sure all changes are merged to the `main` branch and CI is passing.

### 2. Create a Git Tag

Create a semantic version tag. The tag must match the pattern `v{major}.{minor}.{patch}` or `{major}.{minor}.{patch}`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

**Valid tag formats:**
- `v1.0.0` (recommended)
- `1.0.0` 
- `v1.0.0-beta.1` (pre-release)
- `v1.0.0-rc.1` (release candidate)

### 3. Create a GitHub Release

1. Go to the [Releases page](https://github.com/mieweb/ozwellai-api/releases)
2. Click "Create a new release"
3. Select the tag you just created
4. Add a release title (e.g., "v1.0.0")
5. Add release notes describing the changes
6. Click "Publish release"

### 4. Automated Publishing

Once the release is published, GitHub Actions will automatically:

1. **Extract version** from the git tag
2. **Validate** that the tag is a proper semantic version
3. **Update package.json** with the new version
4. **Build** the client in all formats (ESM, CJS, types)
5. **Publish to npm** as `ozwellai`
6. **Update jsr.json** with the new version
7. **Publish to JSR** as `@mieweb/ozwellai`

### 5. Verify Publication

After the workflow completes, verify the package was published:

- **npm**: https://www.npmjs.com/package/ozwellai
- **JSR**: https://jsr.io/@mieweb/ozwellai

## Pre-release Versions

For beta/RC releases, use pre-release tags:

```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

When creating the GitHub release, check the "Set as a pre-release" option.

## Troubleshooting

### Invalid Version Tag

If the workflow fails with "Tag is not a valid semantic version":
- Ensure your tag follows semantic versioning (e.g., `v1.0.0`, not `version-1.0`)
- Check that there are no extra characters or spaces

### Publish Failures

If publishing fails:
- Check that the `NPM_TOKEN` secret is configured
- Verify the package name isn't already taken
- Ensure JSR permissions are properly set

### Version Conflicts

If a version already exists:
- Delete the problematic tag: `git tag -d v1.0.0 && git push origin :refs/tags/v1.0.0`
- Create a new tag with an incremented version
- Create a new release

## Workflow Architecture

For detailed information about our CI/CD architecture, including workflow relationships, reusable patterns, and the complete publishing pipeline, see [**Workflow Architecture**](.github/ARCHITECTURE.md).

**Quick Summary:**
- **CI workflows** run on every push/PR for fast feedback
- **Publish workflows** run only on GitHub releases for controlled publishing  
- **Reusable test workflows** ensure consistency across all pipelines

This separation ensures code quality on every change while giving you control over when new versions are released to users.
