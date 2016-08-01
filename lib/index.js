import fs from 'fs';
import path from 'path';
import client from 'scha/lib/client';
import schaMatch from 'scha/lib/match';
import { schaDataUri, schaEncode, schaCardBuild } from './scha';
import schaStore from './scha-store';
import schaPeer from './scha-peer';

const _quote = str => `"${str}"`;
const _url = str => `url("${str}")`;
const _peerFlag = /:[VOMA][0-6]\d{2}[\+-]?[\da-f]{32}/;

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

  processPeer(peer) {
    if (!_peerFlag.test(peer.value)) return;
    if (!schaMatch(peer.value)) return;
    peer.value = client.describe(peer.value)
      .filter(peerTag => _peerFlag.test(peerTag))
      .map(peerTag => {
        let { pre, body, post } = peerTag;

        return `${pre}${this.peerCard(body)}${post}`;
      })
      .join(', ');
  }

  peerCard(file) {
    let [ filePath, fragment ] = schaCardBuild(file);
    let fileData = this.read(filePath);
    let data = schaEncode(fileData);

    return _url(schaDataUri({ data, fragment }));
  }

  read(filePath) {
    if (!(filePath in this._cache)) {
      let ap = path.resolve(this._basePath, filePath);
      this._cache[filePath] = fs.readFileSync(ap);
    }

    return this._cache[filePath];
  }
}


export default function scha(...args) {
  const tranveller = new _PeerTraveller(...args);
  return function (peerPool) {
    peerPool.eachPeer(tranveller.processPeer);
  };
}

export {
  schaPeer,
  SchaStore
}