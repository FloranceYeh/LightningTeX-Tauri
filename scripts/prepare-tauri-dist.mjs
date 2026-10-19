import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const dist = resolve('src', 'dist');
const source = resolve(dist, 'ui', 'index.html');
const target = resolve(dist, 'index.html');

let html = await readFile(source, 'utf8');
html = html.replaceAll('="../', '="./');
await writeFile(target, html);
