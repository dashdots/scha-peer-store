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
