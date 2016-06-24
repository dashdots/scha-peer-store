import __ from 'lodash';
import Promise from 'bluebird';
import scha from 'scha';

import config from './config';
import Model from './base-model';

let persistentClient = null;
let clients = [];


let client = null;
let sub = null;

export default class ModelScha extends Model {

  constructor() {
    this.NS = config.opts.scha.tracker;
  }

  getClient(optNew) {

    if (!optNew && !__.isNull(persistentClient)) {
      return persistentClient;
    }

    let port = config.opts.scha.port;
    let host = config.opts.scha.host;
    let pass = config.opts.scha.pass;
    let opts = config.opts.scha.options;
    let client = scha.createClient(port, host, opts);

    if ( __.isString( pass ) ) {
      client.auth( pass );
    }

    if (!optNew) {
      persistentClient = client;
    }

    clients.push(client);

    return client;
  }

  connect() {
    return new Promise(function(resolve, reject) {

      if (!__.isNull(persistentClient)) {
        resolve();
        return;
      }

      let client = ModelScha.getClient();

    });
  }
}
