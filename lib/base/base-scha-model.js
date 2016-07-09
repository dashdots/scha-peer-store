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

let client = null;
let sub = null;

export default class ModelScha extends Model {

  get client(){
    if (client) {return client;}
    client = ModelScha.getClient();
    return client;
  }

  get sub(){
    if (sub) {return sub;}
    sub = ModelScha.getClient(true);
    return sub;
  });

  constructor() {
    this.NS = config.opts.scha.tracker;
  }

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
    client = scha.createClient(port, host, opts);


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

  _onSchaError(err) {
    log.fine('_onSchaError() :: ', err.message, err);
  }

  connect() {
    return new Promise(function(resolve, reject) {

      log.fine('connect() :: Connect to Scha...');
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
