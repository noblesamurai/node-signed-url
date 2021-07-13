# Signed Url [![Build Status](https://travis-ci.org/noblesamurai/node-signed-url.svg?branch=master)](https://travis-ci.org/noblesamurai/node-signed-url)

> storyblocks API wrapper for node.js

## Installation

This module is installed via npm:

``` bash
$ npm install signed-url
```

## API

### Create a signer

```js
const config = {
  secret: 'my secret', // used to sign and verify everything *required*
  key: 'hash' // the query string key to use (defaults to 'hash')
};
const signer = require('signed-url')(config);
```

### Sign a URL

```js
const options = {
  method: 'GET', // request method (defaults to 'GET')
  ttl: 3600 // expiry time in seconds (optional)
};
const signedUrl = signer.sign(url, options);
```

### Verify a URL

```js
const options = {
  method: 'GET' // request method to validate
};
const valid = signer.verify(signedUrl, options);
```

### Verify with an Express middleware

```js
app.use(signer.verifyMiddleware);
```

## Contributing

### Prerequisites

```
$ pip install pre-commit
```

### Installation

```
$ pre-commit install --install-hooks
```

## License

The BSD License

Copyright (c) 2019, Andrew Harris

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the Andrew Harris nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
