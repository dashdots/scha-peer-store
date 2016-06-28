/**
 * The entities base class.
 */

import __ from 'lodash';

import { ClientEntity } from 'scha-entity';
import schaError from 'scha-error';
import logg from 'logg';
const log = logg.getLogger('scha-peer.BaseEntity');

export default class BaseEntity extends ClientEntity {
  _create(itemData) {
    // stub to default for now until SchaTracker is normalized
    return ClientEntity.prototype._create.call(this, itemData)
      .bind(this)
      .catch(this._normalizeError);
  }

  _update(query, itemData) {
    // stub to default for now until SchaTracker is normalized
    return ClientEntity.prototype._update.call(this, query, itemData)
      .bind(this)
      .catch(this._normalizeError);
  }

  _normalizeError(err) {
    log.fine('_normalizeError() :: Error intercepted, Name:', err.name, 'Message:',
      err.message);

    let error = new schaError.Validation(err);
    switch(err.code) {
    case 11000:

      error.message = 'Duplicate record found';

      delete error.errmsg;
      delete error.code;
      delete error.n;
      delete error.connectionId;
      delete error.ok;

      break;
    case 11001:
      error.message = 'Duplicate record found';
      break;
    default:
      if (err.message === 'record not found') {
        error = new schaError.Error('record not found');
      }

      if (err.type === 'ObjectId' && err.message.match(/Cast to ObjectId failed/)) {
        error.message = 'Attribute requires a proper id value';
      }
    }

    // check for SchaTracker specific validation errors
    if (err.name === 'ValidationError') {
      __.forOwn(err.errors, function(value) {
        error.errors.push(value);
      });
    }
    throw error;
  }
}
