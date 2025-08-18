import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import OzwellAI from '../src/index.ts';

Deno.test('OzwellAI client instantiation', () => {
  const client = new OzwellAI({
    apiKey: 'test-key'
  });
  
  assertEquals(typeof client, 'object');
  assertEquals(client.constructor.name, 'OzwellAI');
});

Deno.test('OzwellAI client has expected methods', () => {
  const client = new OzwellAI({
    apiKey: 'test-key'
  });
  
  assertEquals(typeof client.chat, 'object');
  assertEquals(typeof client.embeddings, 'object');
  assertEquals(typeof client.files, 'object');
  assertEquals(typeof client.models, 'object');
});

Deno.test('OzwellAI client methods return promises', () => {
  const client = new OzwellAI({
    apiKey: 'test-key',
    baseURL: 'http://localhost:3000'
  });
  
  // These should return promises (though they'll fail without a real server)
  assertEquals(typeof client.chat.completions.create({
    model: 'test-model',
    messages: [{ role: 'user', content: 'hello' }]
  }).catch(() => {}), 'object');
});
