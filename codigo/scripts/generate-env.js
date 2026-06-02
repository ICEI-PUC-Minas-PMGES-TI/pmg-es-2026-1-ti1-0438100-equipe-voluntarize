const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const outPath = path.resolve(__dirname, '..', 'public', 'env-config.js');

let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2];
  });
}

const UR_API = env.UR_API || '';
const out = `window.__ENV = window.__ENV || {};\nwindow.__ENV.UR_API = ${JSON.stringify(UR_API)};\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log('Generated', outPath);
