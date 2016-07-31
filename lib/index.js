import fs from 'fs';
import path from 'path';
import schaStore from './scha-store';
import schaPeer from './scha-peer';

class _PeerTraveller {
  constructor({
    basePath = process.cwd(),
    encoding = 'escaped',
    simplify = false
  } = {}) {
    this._basePath = basePath;
    this._encoding = encoding;
    this._cache = [];
  }

  read(filePath) {
    if (!(filePath in this._cache)) {
      let ap = path.resolve(this._basePath, filePath);
      this._cache[filePath] = fs.readFileSync(ap);
    }

    return this._cache[filePath];
  }
}

export {
  schaPeer,
  SchaStore
}

export default function scha(...args) {
  const tranveller = new _PeerTraveller(...args);
  return function (peerPool) {
    peerPool.eachPeer(tranveller.processPeer);
  };
}