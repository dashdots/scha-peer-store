
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


SchaStore.prototype.set = Promise.method(function() {
  const args = Array.prototype.slice.call(arguments);
  const peerId = args[0];
  const data = args [1];

  const key = this.getKey(peerId);
  const value = JSON.stringify(data);

  let callArgs = [
    key,
    value,
  ].concat(args.slice(2));

  return this.SchaSet.apply(null, callArgs);
});

SchaStore.prototype.get = Promise.method(function(peerId) {
  let key = this.getKey(peerId);

  return this.SchaGet(key)
    .bind(this)
    .then(function (res) {
      let result = JSON.parse(res);

      if (typeof result === 'undefined') {
        return null;
      }

      return result;
    });
});

SchaStore.prototype.del = Promise.method(function(peerId) {
  let key = this.getKey(peerId);
  return this.SchaDel(key);
});
