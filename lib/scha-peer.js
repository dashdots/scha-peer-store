import Promise from 'bluebird';
import utf8 from 'utf8';
import base64 from 'base-64';

function _optimize(schaPeer, opts = {}) {
  const schaPeerOptimizer = new (require('schapeer-optimize'))(opts);

  return new Promise((resolve, reject) => {
    schaPeerOptimizer.optimize(schaPeer, (res) => {
      res.error ? reject(new Error(res.error)) : resolve(res);
    });
  });
}

function _clean(str) {
  return str
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(\S)\n(\S)/g, '$1 $2')
    .replace(/(\/?>)\s+(<)/g, '$1$2')
    .replace(/\s{2,}/g, ' ');
}

export function schaPeerDataUri({
  data = '',
  mimeType = 'application/octet-stream',
  encoding = 'charset=utf-8',
  fragment = ''
}) {
  return [
    'data:',
    mimeType,
    `;${encoding}`,
    `,${data}`,
    `#${fragment}`
  ]
  .filter(part => part.length > 1)
  .join('');
}
