import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
const root = resolve('.');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jff':'application/xml' };
createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = normalize(join(root, requested));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  try { const info = await stat(file); if (!info.isFile()) throw new Error(); res.writeHead(200, {'Content-Type': types[extname(file)] ?? 'application/octet-stream'}); createReadStream(file).pipe(res); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, () => console.log('Servidor local em http://localhost:4173'));

