/**
 * ideal-postcodes-core - Ideal Postcodes core frontend javascript library
 * @version v0.2.0
 * @link https://ideal-postcodes.co.uk/
 * @license MIT
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IdealPostcodes;
(function (IdealPostcodes) {
    IdealPostcodes.API_URL = "api.ideal-postcodes.co.uk";
    IdealPostcodes.TLS = true;
    IdealPostcodes.VERSION = "v1";
    IdealPostcodes.DEFAULT_TIMEOUT = 10000;
    /*
     * STRICT_AUTHORISATION forces authorization header usage on
     * autocomplete API which increases latency due to overhead
     * OPTIONS request
     */
    IdealPostcodes.STRICT_AUTHORISATION = false;
})(IdealPostcodes || (IdealPostcodes = {}));
window["IdealPostcodes"] = IdealPostcodes;
var IdealPostcodes;
(function (IdealPostcodes) {
    var Utils;
    (function (Utils) {
        // Credit to https://github.com/component/debounce
        Utils.now = function () { return Date.now(); };
        Utils.debounce = function (func, delay) {
            if (delay === void 0) { delay = 100; }
            var timeout, args, context, timeInvoked, result;
            function later() {
                var timeSinceInvocation = Utils.now() - timeInvoked;
                if (timeSinceInvocation > 0 && timeSinceInvocation < delay) {
                    timeout = setTimeout(later, delay - timeSinceInvocation);
                }
                else {
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout)
                        context = args = null;
                }
            }
            ;
            return function () {
                context = this;
                args = arguments;
                timeInvoked = Utils.now();
                if (!timeout)
                    timeout = setTimeout(later, delay);
                return result;
            };
        };
        Utils.extend = function (target) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            var length = sources.length;
            for (var i = 0; i < length; i++) {
                var source = sources[i];
                for (var key in source) {
                    if (source[key] !== undefined) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    })(Utils = IdealPostcodes.Utils || (IdealPostcodes.Utils = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="../index.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Cache = (function () {
        function Cache() {
            this.store = {
                postcodeStore: {},
                addressStore: {},
                autocompleteStore: {},
                udprnStore: {},
                umprnStore: {}
            };
        }
        Cache.prototype.cacheAddressQuery = function (query, response) {
            this.store.addressStore[query] = response;
        };
        Cache.prototype.getAddressQuery = function (query) {
            return this.store.addressStore[query];
        };
        Cache.prototype.cachePostcodeQuery = function (query, response) {
            this.store.postcodeStore[query] = response;
        };
        Cache.prototype.getPostcodeQuery = function (query) {
            return this.store.postcodeStore[query];
        };
        Cache.prototype.cacheAutocompleteQuery = function (query, response) {
            this.store.autocompleteStore[query] = response;
        };
        Cache.prototype.getAutocompleteQuery = function (query) {
            return this.store.autocompleteStore[query];
        };
        Cache.prototype.cacheUdprnQuery = function (query, response) {
            this.store.udprnStore[query] = response;
        };
        Cache.prototype.getUdprnQuery = function (query) {
            return this.store.udprnStore[query];
        };
        Cache.prototype.cacheUmprnQuery = function (query, response) {
            this.store.umprnStore[query] = response;
        };
        Cache.prototype.getUmprnQuery = function (query) {
            return this.store.umprnStore[query];
        };
        return Cache;
    }());
    IdealPostcodes.Cache = Cache;
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="../index.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Transport;
    (function (Transport) {
        Transport.blankRe = /^\s*$/;
        Transport.AllowedAuthorizationParameters = ["api_key"];
        Transport.detectTls = function (window) {
            try {
                return window.location.protocol !== "http:";
            }
            catch (e) {
                return true;
            }
        };
        Transport.isIE = function (navigator) {
            var nav = navigator ? navigator : window.navigator;
            try {
                var myNav = nav.userAgent.toLowerCase();
                return (myNav.indexOf("msie") !== -1) ? parseInt(myNav.split("msie")[1]) : false;
            }
            catch (e) {
                return false;
            }
        };
        Transport.generateQueryString = function (query) {
            var result = [];
            for (var key in query) {
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
            }
            return result.join("&");
        };
        Transport.constructHeaders = function (headerOptions) {
            var headers = {};
            headers["Authorization"] = Transport.constructAuthenticationHeader(headerOptions);
            return headers;
        };
        Transport.deconstructAuthenticationHeader = function (authorizationHeader) {
            var result = {};
            if (!authorizationHeader)
                return result;
            authorizationHeader
                .replace("IDEALPOSTCODES ", "")
                .trim()
                .split(" ")
                .forEach(function (elem) {
                var e = elem.split("=");
                if (typeof e[0] === "string" && typeof e[1] === "string") {
                    result[e[0]] = e[1].replace(/(^"|"$)/g, "");
                }
            });
            return result;
        };
        Transport.constructAuthenticationHeader = function (authOptions) {
            var authorizationHeader = [];
            for (var i = 0; i < Transport.AllowedAuthorizationParameters.length; i++) {
                var param = Transport.AllowedAuthorizationParameters[i];
                if (authOptions[param] !== undefined) {
                    authorizationHeader.push(param + "=\"" + authOptions[param] + "\"");
                }
            }
            if (authorizationHeader.length === 0)
                return "";
            return "IDEALPOSTCODES " + authorizationHeader.join(" ");
        };
        Transport.constructQueryString = function (options) {
            var queryString = {};
            if (options.filter)
                queryString["filter"] = options.filter.join(",");
            if (options.licensee)
                queryString["licensee"] = options.licensee;
            if (options.tags)
                queryString["tags"] = options.tags.join(",");
            return queryString;
        };
        Transport.constructAutocompleteQueryString = function (options) {
            var queryString = {};
            queryString["query"] = options.query;
            if (options.limit)
                queryString["limit"] = options.limit;
            return queryString;
        };
        Transport.constructAddressQueryString = function (options) {
            var queryString = {};
            queryString["query"] = options.query;
            queryString["page"] = options.page || 0;
            queryString["limit"] = options.limit || 10;
            return queryString;
        };
    })(Transport = IdealPostcodes.Transport || (IdealPostcodes.Transport = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="../index.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Errors;
    (function (Errors) {
        var IdealPostcodesError = (function (_super) {
            __extends(IdealPostcodesError, _super);
            function IdealPostcodesError(options) {
                _super.call(this);
                this.message = "Ideal Postcodes Error: " + options.message;
            }
            return IdealPostcodesError;
        }(Error));
        Errors.IdealPostcodesError = IdealPostcodesError;
        var JsonParseError = (function (_super) {
            __extends(JsonParseError, _super);
            function JsonParseError() {
                _super.call(this, {
                    message: "Unable to parse JSON response"
                });
            }
            ;
            return JsonParseError;
        }(IdealPostcodesError));
        Errors.JsonParseError = JsonParseError;
    })(Errors = IdealPostcodes.Errors || (IdealPostcodes.Errors = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="../index.ts" />
/// <reference path="./standard.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Errors;
    (function (Errors) {
        Errors.parse = function (xhr) {
            var status = xhr.status;
            if (status === 200)
                return;
            switch (status) {
                case 503:
                    return new RateLimitError();
            }
            try {
                return Errors.parseErrorResponse(JSON.parse(xhr.responseText), status);
            }
            catch (e) {
                return new Errors.JsonParseError();
            }
        };
        Errors.parseErrorResponse = function (response, status) {
            var responseCode = response.code;
            var message = response.message;
            if (responseCode === undefined || message === undefined)
                return new GenericApiError();
            return new IdealPostcodesApiError({
                responseCode: responseCode,
                status: status,
                message: message
            });
        };
        var IdealPostcodesApiError = (function (_super) {
            __extends(IdealPostcodesApiError, _super);
            function IdealPostcodesApiError(options) {
                _super.call(this, options);
                if (options.status)
                    this.status = options.status;
                if (options.responseCode)
                    this.responseCode = options.responseCode;
            }
            return IdealPostcodesApiError;
        }(Errors.IdealPostcodesError));
        Errors.IdealPostcodesApiError = IdealPostcodesApiError;
        var RateLimitError = (function (_super) {
            __extends(RateLimitError, _super);
            function RateLimitError() {
                _super.call(this, {
                    status: 503,
                    message: "Rate Limit Reached. Please wait a while before you retry your request"
                });
            }
            return RateLimitError;
        }(IdealPostcodesApiError));
        Errors.RateLimitError = RateLimitError;
        var RequestTimeoutError = (function (_super) {
            __extends(RequestTimeoutError, _super);
            function RequestTimeoutError() {
                _super.call(this, {
                    message: "Request timed out"
                });
            }
            return RequestTimeoutError;
        }(IdealPostcodesApiError));
        Errors.RequestTimeoutError = RequestTimeoutError;
        var GenericApiError = (function (_super) {
            __extends(GenericApiError, _super);
            function GenericApiError() {
                _super.call(this, {
                    message: "Unknown AJAX error occurred when accessing API"
                });
            }
            return GenericApiError;
        }(IdealPostcodesApiError));
        Errors.GenericApiError = GenericApiError;
    })(Errors = IdealPostcodes.Errors || (IdealPostcodes.Errors = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="./utils.ts" />
/// <reference path="../index.ts" />
/// <reference path="../error/api.ts" />
/// <reference path="../utils/utils.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Transport;
    (function (Transport) {
        Transport.getXhr = function () {
            try {
                return new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
            }
            catch (e) {
                return null;
            }
        };
        Transport.xhrRequest = function (options, callback) {
            var url = options.url;
            var queryString = Transport.generateQueryString(options.queryString);
            if (queryString.length > 0)
                url += "?" + queryString;
            var xhr = Transport.getXhr();
            xhr.open(options.method, url, true);
            try {
                for (var attr in options.headers) {
                    xhr.setRequestHeader(attr, options.headers[attr]);
                }
            }
            catch (e) { }
            var abortTimeout = setTimeout(function () {
                xhr.onreadystatechange = function () { };
                xhr.abort();
                callback(new Error("Request timeout"), null, xhr);
            }, options.timeout);
            xhr.onreadystatechange = function () {
                var result;
                if (xhr.readyState === 4) {
                    clearTimeout(abortTimeout);
                    if (xhr.status !== 200) {
                        return callback(IdealPostcodes.Errors.parse(xhr), {}, xhr);
                    }
                    try {
                        result = Transport.blankRe.test(xhr.responseText) ? {} : JSON.parse(xhr.responseText);
                    }
                    catch (e) {
                        return callback(new Error("parsererror"), null, xhr);
                    }
                    return callback(null, result, xhr);
                }
            };
            xhr.send(options.data);
            return xhr;
        };
    })(Transport = IdealPostcodes.Transport || (IdealPostcodes.Transport = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="./utils.ts" />
/// <reference path="../index.ts" />
/// <reference path="../error/api.ts" />
/// <reference path="../utils/utils.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Transport;
    (function (Transport) {
        var jsonpCounter = 0;
        var noop = function () { };
        // Include callback name, any header authorisation, other querystring options
        var jsonpQueryString = function (options, callbackName) {
            options.queryString["callback"] = callbackName;
            var headers = options.headers;
            var auth = Transport.deconstructAuthenticationHeader(headers["Authorization"]);
            IdealPostcodes.Utils.extend(options.queryString, auth);
            return Transport.generateQueryString(options.queryString);
        };
        var extractStatus = function (apiResponse) {
            var code = apiResponse.code;
            if (!code || typeof code !== "number")
                return 500;
            return parseInt(String(code).slice(0, 3));
        };
        Transport.jsonpRequest = function (options, callback) {
            jsonpCounter += 1;
            var url = options.url;
            // Reject non GET requests
            if (options.method && options.method.toLowerCase() !== "get") {
                callback(new Error("Browser is unable to perform non-GET requests"), null, null);
                return null;
            }
            // Generate callbackname
            var callbackName = "idpc_" + IdealPostcodes.Utils.now() + "_" + jsonpCounter;
            // Configure querystring
            var queryString = jsonpQueryString(options, callbackName);
            if (queryString.length > 0)
                url += "?" + queryString;
            var target = document.getElementsByTagName("script")[0] || document.head;
            var timer = setTimeout(function () {
                cleanup();
                callback(new Error("Request timeout"), null, null);
            }, options.timeout);
            var cleanup = function () {
                if (script.parentNode)
                    script.parentNode.removeChild(script);
                window[callbackName] = noop;
                if (timer)
                    clearTimeout(timer);
            };
            var cancel = function () {
                if (window[callbackName])
                    cleanup();
            };
            window[callbackName] = function (result) {
                cleanup();
                var status = extractStatus(result);
                var virtualXhr = {
                    responseText: result,
                    status: status
                };
                if (virtualXhr.status !== 200) {
                    return callback(IdealPostcodes.Errors.parseErrorResponse(result, status), null, virtualXhr);
                }
                return callback(null, result, virtualXhr);
            };
            var script = document.createElement("script");
            script.src = url;
            script.type = "text/javascript";
            target.parentNode.insertBefore(script, target);
            return null;
        };
    })(Transport = IdealPostcodes.Transport || (IdealPostcodes.Transport = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="./utils.ts" />
/// <reference path="./xhr.ts" />
/// <reference path="./jsonp.ts" />
/// <reference path="../index.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var Transport;
    (function (Transport) {
        Transport.defaultHeaders = {
            "Accept": "text/javascript, application/javascript"
        };
        Transport.request = function (options, callback) {
            var strictOptions = {
                url: options.url,
                method: options.method || "GET",
                headers: options.headers || {},
                queryString: options.queryString || {},
                timeout: options.timeout || IdealPostcodes.DEFAULT_TIMEOUT,
                data: options.data || null
            };
            IdealPostcodes.Utils.extend(strictOptions.headers, Transport.defaultHeaders);
            // If IE9, fallback to jsonp
            if (Transport.isIE() && Transport.isIE() < 10)
                return Transport.jsonpRequest(strictOptions, callback);
            // Otherwise proceed with XMLHttpRequest
            return Transport.xhrRequest(strictOptions, callback);
        };
    })(Transport = IdealPostcodes.Transport || (IdealPostcodes.Transport = {}));
})(IdealPostcodes || (IdealPostcodes = {}));
/// <reference path="../index.ts" />
/// <reference path="../utils/utils.ts" />
/// <reference path="../utils/cache.ts" />
/// <reference path="../transport/index.ts" />
/// <reference path="../transport/utils.ts" />
var IdealPostcodes;
(function (IdealPostcodes) {
    var extend = IdealPostcodes.Utils.extend;
    var XhrUtils = IdealPostcodes.Transport;
    var constructHeaders = XhrUtils.constructHeaders;
    var constructQuery = XhrUtils.constructQueryString;
    var constructAddressQuery = XhrUtils.constructAddressQueryString;
    var constructAutocompleteQuery = XhrUtils.constructAutocompleteQueryString;
    var Client = (function () {
        function Client(options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            this.api_key = options.api_key;
            this.tls = options.tls === undefined ? IdealPostcodes.TLS : options.tls;
            this.version = options.version === undefined ? IdealPostcodes.VERSION : options.version;
            this.baseUrl = options.baseUrl === undefined ? IdealPostcodes.API_URL : options.baseUrl;
            this.strictAuthorisation = options.strictAuthorisation === undefined ? IdealPostcodes.STRICT_AUTHORISATION : options.strictAuthorisation;
            this.cache = new IdealPostcodes.Cache();
            var self = this;
            this.autocompleteCallback = function () { };
            this.debouncedAutocomplete = IdealPostcodes.Utils.debounce(function (options) {
                _this.lookupAutocomplete(options, self.autocompleteCallback);
            });
        }
        Client.prototype.apiUrl = function () {
            return "http" + (this.tls ? "s" : "") + "://" + this.baseUrl + "/" + this.version;
        };
        Client.prototype.ping = function (callback) {
            IdealPostcodes.Transport.request({
                url: "http" + (this.tls ? "s" : "") + "://" + this.baseUrl
            }, callback);
        };
        Client.prototype.lookupPostcode = function (options, callback) {
            var _this = this;
            options.api_key = this.api_key;
            var headers = constructHeaders(options);
            var queryString = constructQuery(options);
            var query = options.postcode;
            var cachedResponse = this.cache.getPostcodeQuery(query);
            if (cachedResponse)
                return callback(null, cachedResponse);
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/postcodes/" + encodeURIComponent(options.postcode),
                headers: headers,
                queryString: queryString
            }, function (error, data, xhr) {
                if (error && error.responseCode === 4040)
                    return callback(null, [], xhr);
                if (error)
                    return callback(error, null, xhr);
                _this.cache.cachePostcodeQuery(query, data.result);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.lookupAddress = function (options, callback) {
            var _this = this;
            options.api_key = this.api_key;
            var headers = constructHeaders(options);
            var queryString = constructQuery(options);
            extend(queryString, constructAddressQuery(options));
            var query = options.query;
            var cachedResponse = this.cache.getAddressQuery(query);
            if (cachedResponse)
                return callback(null, cachedResponse);
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/addresses",
                headers: headers,
                queryString: queryString
            }, function (error, data, xhr) {
                if (error)
                    return callback(error, null, xhr);
                _this.cache.cacheAddressQuery(query, data.result);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.lookupAutocomplete = function (options, callback) {
            var _this = this;
            options.api_key = this.api_key;
            var headers = constructHeaders(options);
            var queryString = constructQuery(options);
            extend(queryString, constructAutocompleteQuery(options));
            var query = options.query;
            var cachedResponse = this.cache.getAutocompleteQuery(query);
            if (cachedResponse)
                return callback(null, cachedResponse);
            if (!this.strictAuthorisation) {
                queryString["api_key"] = this.api_key;
                delete headers["Authorization"];
            }
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/autocomplete/addresses",
                headers: headers,
                queryString: queryString
            }, function (error, data, xhr) {
                if (error)
                    return callback(error, null, xhr);
                _this.cache.cacheAutocompleteQuery(query, data.result);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.lookupUdprn = function (options, callback) {
            var _this = this;
            options.api_key = this.api_key;
            var headers = constructHeaders(options);
            var queryString = constructQuery(options);
            var id = options.id;
            var cachedResponse = this.cache.getUdprnQuery(id);
            if (cachedResponse)
                return callback(null, cachedResponse);
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/udprn/" + id,
                headers: headers,
                queryString: queryString
            }, function (error, data, xhr) {
                if (error)
                    return callback(error, null, xhr);
                _this.cache.cacheUdprnQuery(id, data.result);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.lookupUmprn = function (options, callback) {
            var _this = this;
            options.api_key = this.api_key;
            var headers = constructHeaders(options);
            var queryString = constructQuery(options);
            var id = options.id;
            var cachedResponse = this.cache.getUmprnQuery(id);
            if (cachedResponse)
                return callback(null, cachedResponse);
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/umprn/" + id,
                headers: headers,
                queryString: queryString
            }, function (error, data, xhr) {
                if (error)
                    return callback(error, null, xhr);
                _this.cache.cacheUmprnQuery(id, data.result);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.checkKeyUsability = function (options, callback) {
            IdealPostcodes.Transport.request({
                url: this.apiUrl() + "/keys/" + this.api_key,
                queryString: constructQuery(options)
            }, function (error, data, xhr) {
                if (error)
                    return callback(error, null, xhr);
                return callback(null, data.result, xhr);
            });
        };
        Client.prototype.autocompleteAddress = function (options) {
            this.debouncedAutocomplete(options);
        };
        Client.prototype.registerAutocompleteCallback = function (callback) {
            this.autocompleteCallback = callback;
        };
        return Client;
    }());
    IdealPostcodes.Client = Client;
})(IdealPostcodes || (IdealPostcodes = {}));
