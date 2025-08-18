# Release Process

This document explains how to release new versions of the OzwellAI TypeScript client.

## TL;DR

**Quick Release:**
```bash
# 1. Test locally first
./scripts/test-local.sh

# 2. Create and push tag
git tag v1.0.0 && git push origin v1.0.0

# 3. Create GitHub release (triggers automatic publishing)
```

**Manual Publishing:**
```bash
./scripts/publish-client.sh 1.0.0
```

**Debug Issues:**
```bash
# Test individual steps
./scripts/extract-version.sh v1.0.0
./scripts/build-client.sh
DRY_RUN=true ./scripts/publish-client.sh 1.0.0
```

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

1. **Extract version** using `./scripts/extract-version.sh`
2. **Validate** semantic version format
3. **Build and publish** using `./scripts/publish-client.sh`
   - Updates package.json and jsr.json versions
   - Builds client in all formats (ESM, CJS, types)
   - Publishes to npm as `ozwellai`
   - Publishes to JSR as `@mieweb/ozwellai`

## Local Testing

You can test the entire release process locally before creating a release:

### Quick Test
```bash
# Test the complete build and publish process (dry run)
./scripts/test-local.sh
```

### Individual Steps
```bash
# Test version extraction
./scripts/extract-version.sh v1.0.0

# Test building the client
./scripts/build-client.sh

# Test publish process (dry run - won't actually publish)
DRY_RUN=true ./scripts/publish-client.sh 1.0.0
```

### Manual Publishing
If you need to publish manually (not recommended for releases):

```bash
# Authenticate with npm
npm login

# Build and publish
./scripts/publish-client.sh 1.2.3
```

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
- Test locally first: `./scripts/extract-version.sh your-tag`
- Ensure your tag follows semantic versioning (e.g., `v1.0.0`, not `version-1.0`)
- Check that there are no extra characters or spaces

### Build Failures

If the build fails:
- Test locally: `./scripts/build-client.sh`
- Check TypeScript compilation errors
- Verify all tests pass: `cd clients/typescript && npm test`

### Publish Failures

If publishing fails:
- Test locally: `DRY_RUN=true ./scripts/publish-client.sh 1.0.0`
- Check that the `NPM_TOKEN` secret is configured in GitHub
- Verify the package name isn't already taken
- Ensure JSR permissions are properly set

### Local Development Issues

If local scripts fail:
- Ensure dependencies are installed: `cd clients/typescript && npm install`
- Check Node.js version: `node --version` (requires >=18.0.0)
- Verify script permissions: `chmod +x scripts/*.sh`
- For JSR publishing: JSR CLI is included in devDependencies, or install globally: `npm install -g jsr`

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
- **Script-first approach** allows local testing before pushing changes

**Key Scripts:**
- `./scripts/test-local.sh` - Test complete release process locally
- `./scripts/build-client.sh` - Build TypeScript client
- `./scripts/publish-client.sh` - Publish to npm and JSR
- `./scripts/extract-version.sh` - Extract and validate version from tags

This separation ensures code quality on every change while giving you control over when new versions are released to users.
