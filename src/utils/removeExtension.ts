import {
  basename, dirname, extname, join, sep,
} from 'path';

export const removeExtension = (path: string) => {
  if (path.length === 0) {
    return path;
  }

  const withoutExt = basename(path, extname(path));
  const newPath = join(dirname(path), withoutExt);

  if (path.slice(0, 2) === `.${sep}` || path.slice(0, 2) === './') {
    return `.${sep}${newPath}`;
  }

  return newPath;
};
