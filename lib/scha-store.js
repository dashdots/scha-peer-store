import Promise from 'bluebird';

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

  setClient(SchaClient) {
    this.Scha = SchaClient;
    this.SchaSet = Promise.promisify(this.Scha.set.bind(this.Scha));
    this.SchaGet = Promise.promisify(this.Scha.get.bind(this.Scha));
    this.SchaDel = Promise.promisify(this.Scha.del.bind(this.Scha));
  }

  getKey(peerId) {
    return this.peerFlag + peerId;
  }
}

