#!/bin/bash
set -euo pipefail

# Demonstrate type lifecycle and identify current issues
# This script shows the proper flow and current discrepancies

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Type Lifecycle Demonstration"
echo "================================"
echo ""

# 1. Show the source of truth
echo "📋 Source of Truth: /spec/index.ts"
echo "Contains Zod schemas that define all API types"
echo ""

# 2. Build the spec to show generated types
echo "🏗️  Building spec to generate TypeScript definitions..."
cd "$PROJECT_ROOT/spec"
npm run build

echo "✅ Generated files:"
ls -la dist/
echo ""

# 3. Show what should be consumed
echo "📦 Generated Type Definitions:"
echo "These should be imported by clients:"
head -20 dist/index.d.ts
echo "... (truncated)"
echo ""

# 4. Show current TypeScript client issue
echo "⚠️  Current Issue in TypeScript Client:"
echo "Client has manual type definitions instead of importing from spec:"
echo ""
echo "File: /clients/typescript/src/types.ts"
head -10 "$PROJECT_ROOT/clients/typescript/src/types.ts"
echo "... (manual interfaces instead of imports)"
echo ""

# 5. Show the proper way
echo "✅ Proper Approach:"
echo "Client should import from spec like this:"
echo ""
cat << 'EOF'
// /clients/typescript/src/types.ts
export type {
  Message,
  ChatCompletionRequest,
  ChatCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  // ... other types
} from '@mieweb/ozwellai-spec';
EOF
echo ""

# 6. Show dependency setup
echo "🔗 Dependency Configuration:"
echo "Client correctly depends on spec:"
grep -A 3 -B 1 "ozwellai-spec" "$PROJECT_ROOT/clients/typescript/package.json"
echo ""

# 7. Show build verification
echo "🧪 Testing Current Build:"
cd "$PROJECT_ROOT/clients/typescript"
if npm run build; then
    echo "✅ Client builds successfully"
else
    echo "❌ Client build failed"
fi
echo ""

echo "📚 Summary:"
echo "- Source of truth: /spec/index.ts (Zod schemas)"
echo "- Generated types: /spec/dist/index.d.ts"
echo "- Current issue: Client has duplicate manual types"
echo "- Solution: Replace manual types with spec imports"
echo "- Documentation: See TYPE_LIFECYCLE.md for full details"
echo ""
echo "🎯 To modify types:"
echo "1. Edit /spec/index.ts"
echo "2. Run 'cd /spec && npm run build'"
echo "3. Update client imports"
echo "4. Test all consumers"