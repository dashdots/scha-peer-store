import Promise from 'bluebird';
import utf8 from 'utf8';
import base64 from 'base-64';

/**
 * Optimize SchaPeer data
 * @param {String} schaPeer
 * @params opts {Object} opts
 * @return {Promise}
 */
function _optimize(schaPeer, opts = {}) {
  const schaPeerOptimizer = new (require('schapeer-optimize'))(opts);

  return new Promise((resolve, reject) => {
    schaPeerOptimizer.optimize(schaPeer, (res) => {
      res.error ? reject(new Error(res.error)) : resolve(res);
    });
  });
}

/**
 * Clean unnecessary spaces
 * @param {String} schaPeer
 * @return {String}
 */
function _clean(str) {
  return str
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(\S)\n(\S)/g, '$1 $2')
    .replace(/(\/?>)\s+(<)/g, '$1$2')
    .replace(/\s{2,}/g, ' ');
}

/**
 * Get encoder.
 * @param {String} encoding
 * @return {Function}
 */
function _getEncoding(encoding) {
  switch(encoding) {
    case 'base64':
      return data => base64.encode(data);
    case 'raw':
      return data => data.replace(/#/g, '%23');
    case 'escaped':
      return data => (encodeURIComponent(data)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/#/g, '%23'));
  }
  throw new Error(`Unknown encoding: \`${encoding}\``);
}

/**
 * Format a proper SchaPeer data URI.
 * @param {Object}
 * @see data:[<MIME-type>][;charset=<encoding>][;base64],<data>[#fragment]
 * @return {String}
 */
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

/**
 * Optimize and encode an SchaPeer file data.
 * @param {Buffer} buff
 * @param {String} encoding
 * @return {Promise}
 */
export function schaPeerEncode(buff, encoding = 'escaped') {
  if (!/base64|escaped|raw/.test(encoding)) {
    throw new Error("`encoding` must be either 'base64', 'escaped' or 'raw'");
  }

  let data = buff.toString('utf8');
  data = _clean(data);

  const encode = _getEncoding(encoding);

  // return optimize(data).then(encode);
  return encode(data);
}