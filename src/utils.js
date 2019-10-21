const BASE64_REPLACE = { '+': '-', '/': '_', '=': '' };

/**
 * Convert base64 strings to URL safe base64 strings.
 *
 * @param {string} string
 * @return {string}
 */
function urlsafe (string) {
  return string.replace(/[+/=]/g, c => BASE64_REPLACE[c]);
}

/**
 * Convert an integer to a URL safe base64 string.
 *
 * @param {number} number
 * @return {string}
 */
function i2b (number) {
  return urlsafe(Buffer.from(number.toString()).toString('base64'));
}

/**
 * Convert a URL safe base64 string to an integer.
 *
 * @param {string} string
 * @return {number}
 */
function b2i (string) {
  return parseInt(Buffer.from(string, 'base64').toString(), 10);
}

module.exports = { urlsafe, i2b, b2i };
