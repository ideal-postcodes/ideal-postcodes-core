# Changelog

## [0.3.5] - 2017-03-20
- Add Opera 12.16 and below to legacy browser support

## [0.3.4] - 2017-02-15
- Fix client side caching

## [0.3.3] - 2017-02-15
- Fix caching of UDPRN and UMPRN queries

## [0.3.2] - 2017-02-09
- Extend autocomplete callback to return original request options

## [0.3.1] - 2017-02-08
- Export searchFilter interface

## [0.3.0] - 2017-02-07
- Added `postcode_outward` and `post_town` parameters to `lookupAutocomplete` and `lookupAddress` methods
- Added `limit` parameter to `lookupAutocomplete` method
- Fixed caching to account for pagination and other query parameters
- Expose methods to enable, disable and clear cache

## [0.2.0] - 2016-08-19
- checkKeyUsability now accepts options as first argument

## [0.1.3] - 2016-08-18
- Added JSONP fallback
- Restructured library
- Removed IIFE from compiled output

## [0.1.2] - 2016-08-18
- Autocomplete uses querystring auth unless strictly enabled

## [0.1.1] - 2016-06-20
- Change TLS default to true
- Improve documentation

## [0.1.0] - 2016-06-19
- Publish on NPM
- Publish on Bower
- Improve documentation
- Deploy tests on travis

## [0.0.1] - 2016-06-19
- Initial commit
