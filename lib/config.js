/**
 * Plain key value store for options.
 */
import __ from 'lodash';
import schaError from 'scha-error';

const config = {
  opts: {
    scha: {
      tracker: null,
      port: null,
      host: null,
      pass: null,
      options: null,
    },
    errorName: 'scha-peer',
  }
};

/**
 * Set options.
 *
 * @param {Object} opts Key value options.
 */
config.options = function (opts) {
  __.extend(config.opts, opts);
  schaError.setName(config.opts.errorName);
};

export default config;
