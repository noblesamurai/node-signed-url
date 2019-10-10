const expect = require('chai').expect;
const { urlsafe, i2b, b2i } = require('../src/utils');

describe('utils', function () {
  it('should return a url safe base64 string', function () {
    expect(urlsafe('a+b/c==')).to.equal('a-b_c');
  });

  it('should convert an integer to a url safe base64 string', function () {
    expect(i2b(123456)).to.equal('MTIzNDU2');
  });

  it('should convert a base64 string back to an integer', function () {
    expect(b2i('MTIzNDU2')).to.equal(123456);
  });
});
