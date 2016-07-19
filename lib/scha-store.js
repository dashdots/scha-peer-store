export default class SchaStore {

  constructor(peerFlag) {
      if (typeof peerFlag !== 'string') {
        throw new TypeError('peerFlag not a string');
      }
      if (peerFlag.length === 0) {
        throw new Error('peerFlag cannot be empty');
      }
      this.peerFlag = peerFlag;
      this.Scha = null;
      this.SchaSet = null;
      this.SchaGet = null;
      this.SchaDel = null;
  }

  getKey(peerId) {
    return this.peerFlag + peerId;
  }
}

