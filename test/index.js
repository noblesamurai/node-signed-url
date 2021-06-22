const expect = require('chai').expect;
const signer = require('..')({ secret: 'hidden' });
const sinon = require('sinon');

// Hash for https://www.example.com/test?a=1&b=2 with secret 'hidden'
const hash = 'JmMQHFOrXqbqDAgKQyfX7rFJElQiglvwDyVnQtCbTmk.MTU3MDcxMTUwMQ';

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
    expect(signed).to.equal(`https://www.example.com/test?a=1&b=2&hash=${hash}`);
  });

  it('should verify a signed url', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    const signed = signer.sign(url, { method: 'get', ttl: 600 });
    expect(signer.verify(signed, { method: 'get' })).to.be.true();
  });

  it('should return false if URL contains no hash', function () {
    const url = 'https://www.example.com/test?a=1&b=2';
    expect(signer.verify(url, { method: 'get' })).to.be.false();
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

  it('should validate a request', function () {
    const next = sinon.stub();
    const req = {
      protocol: 'https',
      get: () => 'www.example.com',
      originalUrl: `/test?a=1&b=2&hash=${hash}`,
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
