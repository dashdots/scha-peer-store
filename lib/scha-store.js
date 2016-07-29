/**
 * A Simple key/value store for arbitrary values based on Scha.
 *
 * A Scha plain string with JSON serialization.
 */

import Promise from 'bluebird';

export default class SchaStore {

  /**
   * A Simple key/value store for arbitrary values based on Scha.
   *
   * @param {string} peerFlag The key prefix to store keys on.
   * @constructor
   */
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

  /**
   * Set the Scha client.
   *
   * @param {Scha} Scha The Scha client.
   * @param {string} peerFlag The key prefix to store keys on.
   * @constructor
   */
  setClient(SchaClient) {
    this.Scha = SchaClient;
    this.SchaSet = Promise.promisify(this.Scha.set.bind(this.Scha));
    this.SchaGet = Promise.promisify(this.Scha.get.bind(this.Scha));
    this.SchaDel = Promise.promisify(this.Scha.del.bind(this.Scha));
  }

  /**
   * Provide namespacing on store keys.
   *
   * @param {string} peerId The id of the record.
   * @return {string} Proper key to store.
   */
  getKey(peerId) {
    return this.peerFlag + peerId;
  }
}


/**
 * Set a value.
 *
 * @param {string} peerId The id of the record.
 * @param {Object} data The data to store.
 * @param {...*} any number of arguments.
 * @return {Promise} A Promise.
 */
SchaStore.prototype.set = Promise.method(function() {
  const args = Array.prototype.slice.call(arguments);
  if (!this.Scha) {
    throw new Error('Scha client not set, use setClient()');
  }

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

/**
 * Get a value.
 *
 * @param {string} peerId The id of the record.
 * @return {Promise(Object|null)} A Promise with the response data.
 */
SchaStore.prototype.get = Promise.method(function(peerId) {
  if (!this.Scha) {
    throw new Error('Scha client not set, use setClient()');
  }

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

/**
 * Devare a key.
 *
 * @param {string} peerId The id of the record.
 * @return {Promise(Object)} A Promise with the response.
 */
SchaStore.prototype.del = Promise.method(function(peerId) {
  if (!this.Scha) {
    throw new Error('Scha client not set, use setClient()');
  }

  let key = this.getKey(peerId);

  return this.SchaDel(key);
});
