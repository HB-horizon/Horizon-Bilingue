import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const distDir = join(process.cwd(), 'dist');
const basePath = '/Horizon-Bilingue';

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function fix(content, ext) {
  if (ext === '.html') {
    content = content.replace(/(href|src|action)=("|')\//g, `$1=$2${basePath}/`);
    content = content.replace(/(url\()("|')\//g, `$1$2${basePath}/`);
  } else if (ext === '.css') {
    content = content.replace(/(url\()\//g, `$1${basePath}/`);
  } else if (ext === '.js') {
    content = content.replace(/("|')(?:\/)(_expo\/|assets\/|audio\/|favicon\.ico)/g, `$1${basePath}/$2`);
  }
  return content;
}

for (const file of walk(distDir)) {
  const ext = extname(file);
  if (!['.html', '.css', '.js'].includes(ext)) continue;
  let content = readFileSync(file, 'utf-8');
  let fixed = fix(content, ext);
  if (fixed !== content) {
    writeFileSync(file, fixed, 'utf-8');
    console.log(`  Fixed ${file.replace(distDir, '')}`);
  }
}

writeFileSync(join(distDir, '.nojekyll'), '');
console.log('Done.');
