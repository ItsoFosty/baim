import { realpathSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';

export function isPublicFile(root, file) {
  const permitted = path => {
    const rel = relative(root, path).replaceAll('\\', '/');
    return !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../')
      && !rel.split('/').some(part => part.startsWith('.'))
      && rel !== 'target/ludo-api' && !rel.startsWith('target/ludo-api/');
  };
  try { return permitted(file) && permitted(realpathSync(file)); }
  catch { return false; }
}
