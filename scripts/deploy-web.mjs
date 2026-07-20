import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const distDir = join(process.cwd(), 'dist');
const basePath = '/Horizon-Bilingue';

console.log('1. Building web...');
execSync('npx expo export --platform web', { stdio: 'inherit', cwd: process.cwd() });

console.log('2. Fixing paths for GitHub Pages...');
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}
for (const file of walk(distDir)) {
  const ext = extname(file);
  if (!['.html', '.css', '.js'].includes(ext)) continue;
  let content = readFileSync(file, 'utf-8');
  let fixed = content;
  if (ext === '.html') {
    fixed = fixed.replace(/(href|src|action)=("|')\//g, `$1=$2${basePath}/`);
    fixed = fixed.replace(/(url\()("|')\//g, `$1$2${basePath}/`);
  } else if (ext === '.css') {
    fixed = fixed.replace(/(url\()\//g, `$1${basePath}/`);
  } else if (ext === '.js') {
    fixed = fixed.replace(/("|')(?:\/)(_expo\/|assets\/|audio\/|favicon\.ico)/g, `$1${basePath}/$2`);
  }
  if (fixed !== content) writeFileSync(file, fixed, 'utf-8');
}
writeFileSync(join(distDir, '.nojekyll'), '');

console.log('3. Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist --branch gh-pages --message "Deploy web"', { stdio: 'inherit', cwd: process.cwd() });

console.log('✅ Published !');
console.log('https://HB-horizon.github.io/Horizon-Bilingue/');
