const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import the server to get the OpenAPI spec
const buildServer = require('../dist/reference-server/src/server.js').default;

async function writeSpec() {
  try {
    console.log('Starting server to generate OpenAPI spec...');
    const server = await buildServer();

    // Wait for server to be ready
    await server.ready();

    // Get the OpenAPI specification
    const spec = server.swagger();
    
    // Get current git commit hash
    const gitHead = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    
    // Create new spec object with _generated at the top
    const specWithMetadata = {
      _generated: {
        message: `This file is auto-generated from ZOD schemas in /spec. DO NOT EDIT MANUALLY.\n See: https://github.com/mieweb/ozwellai-api/blob/main/spec/index.ts\n\nGit commit: ${gitHead}\n\n`,
        source: "../../spec/index.ts",
        generator: "write-spec.js",
        generatedAt: new Date().toISOString(),
        gitHead: gitHead
      },
      ...spec
    };
    
    // Ensure openapi directory exists
    const openapiDir = path.join(__dirname, '..', 'openapi');
    if (!fs.existsSync(openapiDir)) {
      fs.mkdirSync(openapiDir, { recursive: true });
    }
    
    // Write the spec to file
    const specPath = path.join(openapiDir, 'openapi.json');
    fs.writeFileSync(specPath, JSON.stringify(specWithMetadata, null, 2));
    
    console.log(`✅ OpenAPI spec written to: ${specPath}`);
    
    // Close the server
    await server.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating OpenAPI spec:', error);
    process.exit(1);
  }
}

writeSpec();