import { test } from 'node:test';
import assert from 'node:assert';
import OzwellAI from '../src/index.js';

test('OzwellAI client instantiation', () => {
  const client = new OzwellAI({
    apiKey: 'test-key'
  });
  
  assert.ok(client instanceof OzwellAI);
});

test('OzwellAI client with custom config', () => {
  const client = new OzwellAI({
    apiKey: 'test-key',
    baseURL: 'https://custom.api.com',
    timeout: 5000,
    defaultHeaders: {
      'X-Custom': 'header'
    }
  });
  
  assert.ok(client instanceof OzwellAI);
});

test('OzwellAI client with Ollama configuration', () => {
  const client = new OzwellAI({
    apiKey: 'ollama'
  });
  
  assert.ok(client instanceof OzwellAI);
  // We can't directly test the private baseURL property, but we can verify
  // the client instantiates correctly with the "ollama" key
});

test('OzwellAI client with Ollama (case insensitive)', () => {
  const client = new OzwellAI({
    apiKey: 'OLLAMA'
  });
  
  assert.ok(client instanceof OzwellAI);
  // Test that uppercase "OLLAMA" also works
});

// Test for Deno compatibility
test('exports are available', () => {
  assert.ok(typeof OzwellAI === 'function');
});
