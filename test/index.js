const expect = require('chai').expect;
const sinon = require('sinon');
const signer = require('..')({ secret: 'hidden' });

describe('index', function () {
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    clock.tick(1570710900371);
  });

  afterEach(function () {
    clock.restore();
  });

  it('should sign a url', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = signer.sign(url, { method: 'get', ttl: 600 });
    expect(signed).to.equal('https://www.example.com/test?a=1&b=2&hash=***REMOVED***.MTU3MDcxMTUwMQ');
  });

  it('should verify a signed url', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = signer.sign(url, { method: 'get', ttl: 600 });
    expect(signer.verify(signed, { method: 'get' })).to.be.true();
  });

  it('should not verify if the signature is invalid', function () {
    const url = 'https://www.example.com/test?a=1&b=2&hash=fubar';
    expect(signer.verify(url, { method: 'get' })).to.be.false();
  });

  it('should not verify if the signature has expired', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = signer.sign(url, { method: 'get', ttl: 600 });
    clock.tick(1570711900371);
    expect(signer.verify(signed, { method: 'get' })).to.be.false();
  });

  it('should not verify if the method is different', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = signer.sign(url, { method: 'put', ttl: 600 });
    expect(signer.verify(signed, { method: 'get' })).to.be.false();
  });

  it('should ignore excluded query params', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = new URL(signer.sign(url, { method: 'put', ttl: 600 }));
    signed.searchParams.set('c', 'blerg');
    signed.searchParams.set('d', 'things');
    expect(signer.verify(signed.href, { method: 'put', exclude: ['c', 'd'] })).to.be.true();
  });

  it('should validate a request', function () {
    const next = sinon.stub();
    const req = {
      protocol: 'https',
      get: () => 'www.example.com',
      originalUrl: '/test?a=1&b=2&hash=***REMOVED***.MTU3MDcxMTUwMQ',
      method: 'GET'
    };
    const middleware = signer.verifyMiddleware;
    middleware(req, {}, next);
    expect(next).to.have.been.calledWithExactly(/* no arguments */);
  });

  it('should fail a request', function () {
    const next = sinon.stub();
    const req = {
      protocol: 'https',
      get: () => 'www.example.com',
      originalUrl: '/test?a=1&b=2&hash=fubar',
      method: 'GET'
    };
    const middleware = signer.verifyMiddleware;
    middleware(req, {}, next);
    expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
  });
});
