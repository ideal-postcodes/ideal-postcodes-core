> As of September 2019, we've released a modern a revamped javascript client at [@ideal-postcodes/core-browser](https://github.com/ideal-postcodes/core-browser). Documentation for the legacy client [ideal-postcodes-core](https://www.npmjs.com/package/ideal-postcodes-core) can be found [here](https://ideal-postcodes.co.uk/documentation/ideal-postcodes-core).

![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=RlN3VXIwTzJqcFhXaUFVb1pvc1lRTkFvc0d2VDJwS1lyL0R6VUpVbTJxWT0tLXRFaG9vbUI1c1NybmxSZG5kc2h0NGc9PQ==--90b7bb2059049ace502b49913e2b650d9f9a2c6b) [![Build Status](https://travis-ci.org/ideal-postcodes/ideal-postcodes-core.svg?branch=master)](https://travis-ci.org/ideal-postcodes/ideal-postcodes-core) [![npm version](https://badge.fury.io/js/ideal-postcodes-core.svg)](https://badge.fury.io/js/ideal-postcodes-core) ![gzip file size](http://img.badgesize.io/ideal-postcodes/ideal-postcodes-core/master/dist/ideal-postcodes-core.min.js.svg?compression=gzip) ![file size](http://img.badgesize.io/ideal-postcodes/ideal-postcodes-core/master/dist/ideal-postcodes-core.min.js.svg)

# Ideal Postcodes - Frontend Client

## Introduction

This library provides a core set of API's to interact with the Ideal Postcodes API on the browser. 

You may accomplish the following jobs using this library:

- Query addresses for a postcode
- Query for an address with an address fragment
- Autocomplete an address
- Lookup an address by ID
- Check key useability

## Build Status & Browser Compatibility Information

This library is tested across modern desktop and mobile browers

Internet Explorer 9 and above is supported. Internet Explorer 6, 7 and 8 are not supported

## Methods

Please see our [documentation](https://ideal-postcodes.co.uk/documentation/ideal-postcodes-core)

## Installation

You may install it via npm with,

```bash
npm install ideal-postcodes-core --save
```

You may also use Bower with,

```bash
bower install ideal-postcodes-core --save
```

Finally you can install it manually by copying the minified build from `/dist/`

## Testing

Run the test suite with,

```bash
gulp test
```

You may test the library manually in a browser console with,

```bash
gulp webserver
```

## License

MIT
