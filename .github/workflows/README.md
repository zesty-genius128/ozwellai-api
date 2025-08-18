# GitHub Workflows

This directory contains the CI/CD workflows for the OzwellAI API project.

For a complete overview of the workflow architecture, relationships, and benefits, see [**Workflow Architecture**](../ARCHITECTURE.md).

## Quick Reference

| File | Purpose | Trigger |
|------|---------|---------|
| `typescript-client-ci.yml` | TypeScript client CI | Push/PR |
| `reference-server-ci.yml` | Reference server CI | Push/PR |  
| `publish-typescript-client.yml` | Publish to npm/JSR | Release |
| `publish-reference-server.yml` | Publish Docker image | Release |
| `test-typescript-client.yml` | Reusable test matrix | Called by others |
| `test-reference-server.yml` | Reusable test matrix | Called by others |

## Developer Usage

### Manual Testing
You can manually trigger the reusable test workflow for debugging:

```yaml
on:
  workflow_dispatch:

jobs:
  test:
    uses: ./.github/workflows/test-typescript-client.yml
```

### Custom Test Matrix
The reusable workflow accepts inputs for customization:

```yaml
jobs:
  test:
    uses: ./.github/workflows/test-typescript-client.yml
    with:
      working-directory: './clients/my-custom-client'
```
