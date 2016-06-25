/**
 * The entities base class.
 */

import __ from 'lodash';

import { ClientEntity } from 'scha-entity';
import schaError from 'scha-error';

export default class BaseEntity extends ClientEntity {
  _create(itemData) {
    return ClientEntity.prototype._create.call(this, itemData)
      .bind(this)
      .catch(this._normalizeError);
  }

  _update(query, itemData) {
    return ClientEntity.prototype._update.call(this, query, itemData)
      .bind(this)
      .catch(this._normalizeError);
  }

}
