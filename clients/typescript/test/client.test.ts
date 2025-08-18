import { test, assert } from 'node:test';
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

// Test for Deno compatibility
test('exports are available', () => {
  assert.ok(typeof OzwellAI === 'function');
});
