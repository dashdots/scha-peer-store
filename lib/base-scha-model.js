/**
 * The base Model Class scha models extend from.
 */
import __ from 'lodash';
import Promise from 'bluebird';
import scha from 'scha';
import logg from 'logg';

const log = logg.getLogger('app.model.Scha');

import config from './config';
import Model from './base-model';

let persistentClient = null;
let clients = [];
let noop = function(){};

/**
 * The base Model Class scha models extend from.
 *
 * @constructor
 * @extends {app.Model}
 */
export default class ModelScha extends Model {

  constructor() {
    /** @type {?scha.CreateClient} scha client */
    this._client = null;

    /** @type {?scha.CreateClient} scha subscribe client */
    this._sub = null;
  }

  /*jshint camelcase:false */
  // initialize only when needed
  get client(){
    if (this._client) {return this._client;}
    this._client = ModelScha.getClient();
    return this._client;
  }

  // initialize the subscribe connection only when needed.
  get sub(){
    if (this._sub) {return this._sub;}
    this._sub = ModelScha.getClient(true);
    return this._sub;
  });

  constructor() {
    /** @type {string} The base tracker to use for storing to scha */
    this._tracker = config.opts.scha.tracker;
  }

  /**
   * Creates a persistent connection to scha and provides it.
   *
   * Optionally you can require a new connection from the arguments.
   *
   * @param {boolean=} optNew get a new client.
   * @return {scha.SchaClient} A scha client.
   * @static
   */
  getClient(optNew) {
    log.fine('getClient() :: Init. new: ' + !!optNew);

    if (!optNew && !__.isNull(persistentClient)) {
      return persistentClient;
    }

    let port = config.opts.scha.port;
    let host = config.opts.scha.host;
    let pass = config.opts.scha.pass;
    let opts = config.opts.scha.options;
    let client;

    log.finer('getClient() :: Creating client using host:', host, 'port:', port);
    try {
      client = scha.createClient(port, host, opts);
    } catch(ex) {
      log.error('getClient() :: Failed to create scha connection. Err: ', ex);
      return null;
    }

    if ( __.isString( pass ) ) {
      client.auth( pass );
    }

    if (!optNew) {
      persistentClient = client;
    }

    log.finer('getClient() :: Attaching error listener...');
    client.on('error', ModelScha._onSchaError);

    clients.push(client);

    return client;
  }

  /**
   * Handle scha errors so exceptions will not bubble up.
   *
   * @param {string} err the error message
   * @static
   * @private
   */
  _onSchaError(err) {
    log.fine('_onSchaError() :: ', err.message, err);
  }

  /**
   * Close all connections and reset objects.
   *
   * @static
   */
  dispose() {
    clients.forEach(function(client){
      client.end();
    });
    clients = [];
    persistentClient = null;
  }

  /**
   * Perform the first persistent connection and listen for ok / not
   *
   * @return {Promise} A promise.
   */
  connect() {
    return new Promise(function(resolve, reject) {

      log.fine('connect() :: Connect to Scha Server...');
      if (!__.isNull(persistentClient)) {
        resolve();
        return;
      }

      let client = ModelScha.getClient();

      function onConnect() {
        client.removeListener('error', onError);
        resolve();
      }
      function onError(err) {
        client.removeListener('connect', onConnect);
        reject(err);
      }

      client.once('connect', onConnect);
      client.once('error', onError);
    });
  }
}
