import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  let targetUrl = specifier;

  if (specifier.startsWith('@/')) {
    const relPath = specifier.slice(2);
    targetUrl = pathToFileURL(path.resolve(process.cwd(), 'src', relPath)).href;
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (context.parentURL) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      targetUrl = pathToFileURL(path.resolve(parentDir, specifier)).href;
    }
  }

  // If fileURL, check if we need to append .js or /index.js
  if (targetUrl.startsWith('file://')) {
    const filePath = fileURLToPath(targetUrl);
    if (fs.existsSync(`${filePath}.js`)) {
      targetUrl = pathToFileURL(`${filePath}.js`).href;
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (fs.existsSync(path.join(filePath, 'index.js'))) {
        targetUrl = pathToFileURL(path.join(filePath, 'index.js')).href;
      }
    }
  }

  return nextResolve(targetUrl, context);
}
