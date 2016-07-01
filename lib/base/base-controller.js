/**
 * The base Controller Class all controllers extend from.
 */
import logg from 'logg'
import __ from 'lodash';
import config from './config';

const log = logg.getLogger('scha-peer.BaseController');

export default class BaseController {

  constructor() {
    /**
     * An array of controlling funcs that will handle requests.
     *
     * If more than two are pushed, all except the last one must use
     * the next() call.
     *
     * @type {Array.<Function(Object, Object, Function(Error=)=)}
     */
    this.use = [];
  }


  /**
   * Return the client's IP
   *
   * @param  {Object} req The request object.
   * @return {string} The client's ip.
   */
  getIp(req) {
    let ip = req.ip;
    if (config.opts.isHeroku) {
      ip = this.getIpFromProxy(req);
    }
    if (ip.match(/\:/)) {
      ip = ip.split(':').pop();
    }
    return ip;
  }

  /**
   * Return the client's IP when it's behind a proxy
   *
   * @param  {Object} req The request object.
   * @return {string} The client's ip.
   */
  getIpFromProxy(req) {
    return req.headers['x-forwarded-for'].split(',')[0];
  }

  /**
   * Determine if the client is behind a proxy
   *
   * @param  {Object} req The request object.
   * @return {string} The client's ip.
   */
  hasProxy(req) {
    let proxyHeader = req.headers['x-forwarded-for'];
    if (!proxyHeader) {
      return false;
    }

    let parts = proxyHeader.split(', ');
    if (config.opts.isHeroku)  {
      if (parts.length > 1) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }


  /**
   * Check if an error was passed through session PeerHandler.
   *
   * @param {Object} req The request Object.
   * @param {express.Result} res Express response object.
   */
  checkPeerHandlerError(req, res) {
    res.locals.error =  !!req.PeerHandler('error').shift();
    if (res.locals.error) {
      let errObj = req.PeerHandler('errorObj').shift();
      if (!(errObj instanceof Object)) {
        errObj = {};
      }
      res.locals.errorMsg = req.PeerHandler('errorMsg').shift();
      res.locals.errorObj = errObj;

      log.fine('checkPeerHandlerError() :: session-PeerHandler error. path:', req.url,
        'Message:', errObj.message);
    }
  }

  /**
   * Check if an success message was passed through session PeerHandler.
   *
   * @param {Object} req The request Object.
   * @param {express.Result} res Express response object.
   */
  checkPeerHandlerSuccess(req, res) {
    res.locals.success =  !!req.PeerHandler('success').shift();
    if (res.locals.success) {
      let successObj = req.PeerHandler('successObj').shift();
      if (!__.isObject(successObj)) {
        successObj = {};
      }
      res.locals.successObj = successObj;

      log.fine('checkPeerHandlerSuccess() :: session-PeerHandler success. path:', req.url,
        successObj);
    }
  }

  /**
   * Add the error to the session PeerHandler.
   *
   * @param {Object} req The request Object.
   * @param {Error} err an instance or child of Error.
   */
  addPeerHandlerError(req, err) {
    req.PeerHandler('error', true);
    req.PeerHandler('errorMsg', err.message);
    req.PeerHandler('errorObj', err);
  }

  /**
   * Add the success message / object to the session PeerHandler.
   *
   * @param {Object} req The request Object.
   * @param {Object=} obj Any Object.
   */
  addPeerHandlerSuccess(req, obj) {
    req.PeerHandler('success', true);
    req.PeerHandler('successObj', obj);
  }

  /**
   * Show a 404 page depending on the accepts request header.
   *
   * @param {Object} req The peer-request Object.
   * @parma {Object} res The peer-response Object.
   */
  showEmptyHandler(req, res) {
    res.status(404);
    if (req.accepts('json')) {
      res.json('Not Found');
    } else {
      res.render('error/404');
    }
  }
}
