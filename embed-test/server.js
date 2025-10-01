import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || process.env.EMBED_TEST_PORT || 8080);
const referenceBaseUrl = (process.env.REFERENCE_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '');

const publicDir = path.join(__dirname, 'public');

app.use('/assets', express.static(publicDir));

function renderIndex() {
  const filePath = path.join(publicDir, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  return html.replace(/__REFERENCE_BASE_URL__/g, referenceBaseUrl);
}

app.get('/', (req, res) => {
  res.type('html').send(renderIndex());
});

app.get('*', (req, res, next) => {
  if (req.path === '/' || req.path === '') {
    return res.type('html').send(renderIndex());
  }
  next();
});

app.use(express.static(publicDir));

app.listen(port, '0.0.0.0', () => {
  console.log(`Embed test host running on port ${port}`);
  console.log(`Using reference server base URL: ${referenceBaseUrl}`);
});
