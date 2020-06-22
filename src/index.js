const abind = require('abind');
const createError = require('http-errors');
const ow = require('ow');
const { createHmac } = require('crypto');
const { URL, format: formatUrl } = require('url');
const { urlsafe, i2b, b2i } = require('./utils');

class SignedUrl {
  constructor (options = {}) {
    const { key = 'hash', secret } = options;
    this.secret = secret;
    this.key = key;
    abind(this);
  }

  hash (url, options = {}) {
    const { method = 'GET', expire } = options;
    const u = new URL(url);
    u.searchParams.delete(this.key);
    u.searchParams.sort();
    const contents = [method.toUpperCase(), formatUrl(u), expire].filter(Boolean).join(':');
    const hash = createHmac('sha256', this.secret).update(contents).digest('base64');
    return [urlsafe(hash), expire && i2b(expire)].filter(Boolean).join('.');
  }

  sign (url, options = {}) {
    const { ttl } = options;
    const expire = ttl && Math.ceil(Date.now() / 1000) + ttl;
    const u = new URL(url);
    u.searchParams.set(this.key, this.hash(url, { ...options, expire }));
    return formatUrl(u);
  }

  verify (url, options = {}) {
    const u = new URL(url);
    const hash = u.searchParams.get(this.key);
    if (!ow.isValid(hash, ow.string.nonEmpty)) return false;
    const [, exp] = hash.split('.');
    const expire = exp && b2i(exp);
    const expired = expire && expire < Date.now() / 1000;
    return !expired && hash === this.hash(url, { ...options, expire });
  }

  verifyMiddleware (req, res, next) {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    if (this.verify(url, { method: req.method })) return next();
    next(createError(401));
  }
}

function signer (options) {
  return new SignedUrl(options);
}

module.exports = signer;
