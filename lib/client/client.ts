/// <reference path="../index.ts" />
/// <reference path="../utils/utils.ts" />
/// <reference path="../utils/cache.ts" />
/// <reference path="../transport/index.ts" />
/// <reference path="../transport/utils.ts" />

namespace IdealPostcodes {
	const extend = IdealPostcodes.Utils.extend;
	const XhrUtils = IdealPostcodes.Transport;
	const constructHeaders = XhrUtils.constructHeaders;
	const constructQuery = XhrUtils.constructQueryString;
	const constructAddressQuery = XhrUtils.constructAddressQueryString;
	const constructAutocompleteQuery = XhrUtils.constructAutocompleteQueryString;

	export class Client {
		protected tls: boolean;
		protected api_key: string;
		protected baseUrl: string;
		protected version: string;
		protected cache: IdealPostcodes.Cache;
		protected strictAuthorisation: boolean;
		protected autocompleteCallback: AutocompleteXhrCallback;
		protected debouncedAutocomplete: (options: LookupAutocompleteOptions) => void;

		constructor(options: ClientOptions = {}) {
			this.api_key = options.api_key;
			this.tls = options.tls === undefined ? IdealPostcodes.TLS : options.tls;
			this.version = options.version === undefined ? IdealPostcodes.VERSION : options.version;
			this.baseUrl = options.baseUrl === undefined ? IdealPostcodes.API_URL : options.baseUrl;
			this.strictAuthorisation = options.strictAuthorisation === undefined ? IdealPostcodes.STRICT_AUTHORISATION : options.strictAuthorisation;
			this.cache = new IdealPostcodes.Cache();
			const self = this;
			this.autocompleteCallback = () => {};

			// Need to consider caching as well! Can't store meta in cache store

			this.debouncedAutocomplete = IdealPostcodes.Utils.debounce((options: LookupAutocompleteOptions) => {
				this.lookupAutocomplete(options, self.autocompleteCallback);
			});
		}

		apiUrl() {
			return `http${this.tls ? "s" : ""}://${this.baseUrl}/${this.version}`;
		}

		ping(callback: XhrCallback): void {
			IdealPostcodes.Transport.request({
				url: `http${this.tls ? "s" : ""}://${this.baseUrl}`
			}, callback);
		}

		lookupPostcode(options: LookupPostcodeOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);

			const cachedResponse = this.cache.getPostcodeQuery(options);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/postcodes/${encodeURIComponent(options.postcode)}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error && error.responseCode === 4040) return callback(null, [], xhr);
				if (error) return callback(error, null, xhr);
				this.cache.cachePostcodeQuery(options, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupAddress(options: LookupAddressOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			extend(queryString, constructAddressQuery(options));

			const cachedResponse = this.cache.getAddressQuery(options);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/addresses`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheAddressQuery(options, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupAutocomplete(options: LookupAutocompleteOptions, callback: AutocompleteXhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			extend(queryString, constructAutocompleteQuery(options));

			const cachedResponse = this.cache.getAutocompleteQuery(options);
			if (cachedResponse) return callback(null, cachedResponse, null, options);

			if (!this.strictAuthorisation) {
				queryString["api_key"] = this.api_key;
				delete headers["Authorization"];
			}

			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/autocomplete/addresses`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr, options);
				this.cache.cacheAutocompleteQuery(options, data.result);
				return callback(null, data.result, xhr, options);
			});
		}

		lookupUdprn(options: LookupIdOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);

			const cachedResponse = this.cache.getUdprnQuery(options);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/udprn/${options.id}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheUdprnQuery(options, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupUmprn(options: LookupIdOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);

			const cachedResponse = this.cache.getUmprnQuery(options);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/umprn/${options.id}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheUmprnQuery(options, data.result);
				return callback(null, data.result, xhr);
			});
		}

		checkKeyUsability(options: BasicOptions, callback: XhrCallback): void {
			IdealPostcodes.Transport.request({
				url: `${this.apiUrl()}/keys/${this.api_key}`,
				queryString: constructQuery(options)
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				return callback(null, data.result, xhr);
			});
		}

		autocompleteAddress(options: LookupAutocompleteOptions): void {
			this.debouncedAutocomplete(options);
		}

		registerAutocompleteCallback(callback: AutocompleteXhrCallback): void {
			this.autocompleteCallback = callback;
		}
	}
}
