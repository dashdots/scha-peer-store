import EntityBase from './base-entity';
import ModelBase from './base-model';
import ControllerBase from './base-controller';
import MidwareBase from './base-midware';
import ModelSchaBase from './base-model-scha';

import config from './config';

/**
 * exports all items.
 */
const base = module.exports = {
  EntityBase: EntityBase,
  ModelBase: ModelBase,
  ControllerBase: ControllerBase,
  ModelSchaBase: ModelSchaBase,
  MidwareBase: MiddlewareBase,
};

base.options = config.options;
