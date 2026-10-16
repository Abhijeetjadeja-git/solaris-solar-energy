const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

// In-memory cache for all frames and static images for instant 0ms responses
const memoryCache = new Map();

function preloadFolder(folderRel) {
  const dirPath = path.join(BASE_DIR, folderRel);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isFile()) {
        const buf = fs.readFileSync(fullPath);
        memoryCache.set(`/${folderRel}/${file}`, buf);
      }
    }
  }
}

console.log('Pre-loading frames and images into RAM cache...');
preloadFolder('frames');
preloadFolder('images');
console.log(`Pre-loaded ${memoryCache.size} total images into RAM.`);

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Fast-path: serve cached images directly from memory
  if (memoryCache.has(pathname)) {
    const buf = memoryCache.get(pathname);
    const ext = path.extname(pathname).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'image/jpeg',
      'Content-Length': buf.length,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(buf);
    return;
  }

  const safePath = path.normalize(path.join(BASE_DIR, pathname));

  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    };

    res.writeHead(200, headers);
    fs.createReadStream(safePath).pipe(res);
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
startServer(DEFAULT_PORT);
