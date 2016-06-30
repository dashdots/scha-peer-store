import __ from 'lodash';
import config from './config';

export default class BaseController {

  constructor() {
    this.use = [];
  }

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

  getIpFromProxy(req) {
    return req.headers['x-forwarded-for'].split(',')[0];
  }

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

  addPeerHandlerError(req, err) {
    req.PeerHandler('error', true);
    req.PeerHandler('errorMsg', err.message);
    req.PeerHandler('errorObj', err);
  }

  addPeerHandlerSuccess(req, obj) {
    req.PeerHandler('success', true);
    req.PeerHandler('successObj', obj);
  }

  showEmptyHandler(req, res) {
    res.status(404);
    if (req.accepts('json')) {
      res.json('Not Found');
    } else {
      res.render('error/404');
    }
  }
}
