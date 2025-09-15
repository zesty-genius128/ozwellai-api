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
  
  assertEquals(typeof client.createChatCompletion, 'function');
  assertEquals(typeof client.createEmbedding, 'function');
  assertEquals(typeof client.listFiles, 'function');
  assertEquals(typeof client.listModels, 'function');
});

Deno.test('OzwellAI client with Ollama configuration', () => {
  const client = new OzwellAI({
    apiKey: 'ollama'
  });
  
  assertEquals(typeof client, 'object');
  assertEquals(client.constructor.name, 'OzwellAI');
});

Deno.test('OzwellAI client with Ollama (case insensitive)', () => {
  const client = new OzwellAI({
    apiKey: 'OLLAMA'
  });
  
  assertEquals(typeof client, 'object');
  assertEquals(client.constructor.name, 'OzwellAI');
});
