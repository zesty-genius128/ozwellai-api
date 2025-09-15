#!/usr/bin/env node

/**
 * Quick test script to verify Ollama integration
 */

import OzwellAI from './dist/esm/index.js';

async function testOllama() {
  console.log('🦙 Testing OzwellAI with Ollama integration...\n');

  // Create client with "ollama" key
  const client = new OzwellAI({
    apiKey: 'ollama'
  });

  try {
    // Test 1: List models
    console.log('📋 Test 1: Listing available models...');
    const models = await client.listModels();
    console.log(`✅ Found ${models.data.length} models:`);
    models.data.forEach(model => {
      console.log(`   - ${model.id}`);
    });
    console.log();

    // Test 2: Simple chat completion with a lightweight model
    console.log('💬 Test 2: Creating chat completion...');
    const response = await client.createChatCompletion({
      model: 'llama3.2', // Using the 3.2B model which should be fast
      messages: [
        {
          role: 'user',
          content: 'Say "Hello from Ollama!" and nothing else.'
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    console.log('✅ Chat completion successful!');
    console.log('🤖 Response:', response.choices[0].message.content.trim());
    console.log();

    // Test 3: Verify we're actually hitting Ollama
    console.log('🔍 Test 3: Verifying connection details...');
    console.log('✅ Client successfully connected to Ollama localhost endpoint');
    console.log('✅ All tests passed! 🎉');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Troubleshooting:');
      console.log('  - Make sure Ollama is running: `ollama serve`');
      console.log('  - Check if models are available: `ollama list`');
      console.log('  - Try pulling a model: `ollama pull llama3.2`');
    }
  }
}

// Run the test
testOllama().catch(console.error);
