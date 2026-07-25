import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';

const distDir = join(process.cwd(), 'dist');

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

async function inlineIndex() {
  const indexPath = join(distDir, 'index.html');
  if (!existsSync(indexPath)) {
    console.error('dist/index.html not found. Run build first: npx expo export --platform web');
    process.exit(1);
  }

  let html = readFileSync(indexPath, 'utf-8');

  // Inline CSS
  html = await inlineAssets(html, /<link[^>]+href="([^"]+\.css)"[^>]*>/g, (url) => {
    const filePath = join(distDir, url.replace(/^\//, ''));
    if (existsSync(filePath)) {
      const css = readFileSync(filePath, 'utf-8');
      return `<style>${css}</style>`;
    }
    return null;
  });

  // Inline JS (module scripts)
  html = await inlineAssets(html, /<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g, (url) => {
    const filePath = join(distDir, url.replace(/^\//, ''));
    if (existsSync(filePath)) {
      const js = readFileSync(filePath, 'utf-8');
      // Don't inline speech module - it's lazy loaded
      if (url.includes('Speech-')) return null;
      return `<script>${js}</script>`;
    }
    return null;
  });

  // Remove preload links for CSS/JS (they're now inlined)
  html = html.replace(/<link[^>]+rel="preload"[^>]+href="[^"]+\.(css|js)"[^>]*>/g, '');

  // Remove remaining external link tags for CSS/JS (already inlined)
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, '');
  html = html.replace(/<script[^>]+src="[^"]+\.js"[^>]*><\/script>/g, '');

  // Add base tag for proper asset resolution
  html = html.replace('<head>', '<head><base href="/">');

  // Write the self-contained file
  const outputPath = join(process.cwd(), 'index.html');
  writeFileSync(outputPath, html, 'utf-8');
  console.log('Self-contained index.html created at:', outputPath);
  console.log('Size:', (Buffer.byteLength(html) / 1024 / 1024).toFixed(1), 'MB');
}

async function inlineAssets(content, pattern, loadFn) {
  let result = content;
  let match;
  while ((match = pattern.exec(result)) !== null) {
    const fullMatch = match[0];
    const url = match[1];
    const replacement = await loadFn(url);
    if (replacement) {
      result = result.replace(fullMatch, replacement);
    }
  }
  return result;
}

inlineIndex().catch(console.error);
