# Ozwell Chat Widget - Embed Test Host

## Quick Start

```bash
# Install dependencies
npm install

# Start the test server
PORT=8080 REFERENCE_SERVER_URL=https://ozwellai-reference-server.opensource.mieweb.org npm start
```

Visit `http://localhost:8080` to see the embedded widget in action.

## Live Demo

https://ozwellai-embedtest.opensource.mieweb.org

## What This Does

This is a minimal Express server that demonstrates how to integrate the Ozwell chat widget into a web page. It:

1. Serves a single HTML page (`public/index.html`)
2. Dynamically injects the reference server URL into the page
3. Shows widget events (Save & Close, ready, closed) in a log panel
4. Captures widget output in a textarea

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` or `EMBED_TEST_PORT` | `8080` | Port to run the test server on |
| `REFERENCE_SERVER_URL` | `http://localhost:3000` | Base URL of the reference server hosting the embed bundle |

## Architecture

- **server.js** - Express server that serves `public/index.html` with template replacement
- **public/index.html** - Demo page with `window.OzwellChatConfig` and event listeners
- **public/** - Static assets served under `/assets/`

The server replaces `__REFERENCE_BASE_URL__` placeholders in `index.html` with the actual reference server URL at runtime.

## Integration Pattern

See `public/index.html` for a complete working example of:
- Setting `window.OzwellChatConfig`
- Loading the embed script
- Listening for widget events
- Handling Save & Close functionality
