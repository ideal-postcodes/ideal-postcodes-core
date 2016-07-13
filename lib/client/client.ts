/// <reference path="../index.ts" />
/// <reference path="../ajax/xhr.ts" />
/// <reference path="../utils/utils.ts" />
/// <reference path="../utils/cache.ts" />
/// <reference path="../utils/debounce.ts" />
/// <reference path="../ajax/utils.ts" />

namespace IdealPostcodes {
	export interface BasicOptions {
		api_key?: string;
		licensee?: string;
		filter?: [string];
		tags?: [string];
	}

	export interface LookupPostcodeOptions extends BasicOptions {
		postcode: string;
	}

	export interface LookupAddressOptions extends BasicOptions {
		query: string;
		page?: number;
		limit?: number;
	}

	export interface LookupIdOptions extends BasicOptions {
		id: number;
	}

	export interface LookupAutocompleteOptions extends BasicOptions {
		query: string;
	}

	const extend = IdealPostcodes.Utils.extend;
	const constructHeaders = IdealPostcodes.XhrUtils.constructHeaders;
	const constructQuery = IdealPostcodes.XhrUtils.constructQueryString;
	const constructAddressQuery = IdealPostcodes.XhrUtils.constructAddressQueryString;
	const constructAutocompleteQuery = IdealPostcodes.XhrUtils.constructAutocompleteQueryString;

	export interface ClientOptions {
		tls?: boolean;
		api_key?: string;
		baseUrl?: string;
		version?: string;
	}

	export interface XhrCallback {
		(error: any, data: any, xhr?: XMLHttpRequest): void;
	}

	export class Client {
		protected tls: boolean;
		protected api_key: string;
		protected baseUrl: string;
		protected version: string;
		protected cache: IdealPostcodes.Cache;
		protected autocompleteCallback: XhrCallback;
		protected debouncedAutocomplete: (options: LookupAutocompleteOptions) => void;

		constructor(options: ClientOptions = {}) {
			this.api_key = options.api_key;
			this.tls = options.tls === undefined ? IdealPostcodes.TLS : options.tls;
			this.version = options.version === undefined ? IdealPostcodes.VERSION : options.version;
			this.baseUrl = options.baseUrl === undefined ? IdealPostcodes.API_URL : options.baseUrl;
			this.cache = new IdealPostcodes.Cache();
			const self = this;
			this.autocompleteCallback = () => {};
			this.debouncedAutocomplete = IdealPostcodes.Utils.debounce((options: LookupAutocompleteOptions) => {
				this.lookupAutocomplete(options, self.autocompleteCallback);
			});
		}

		apiUrl() {
			return `http${this.tls ? "s" : ""}://${this.baseUrl}/${this.version}`;
		}

		ping(callback: XhrCallback): void {
			IdealPostcodes.Transport.xhrRequest({
				url: `http${this.tls ? "s" : ""}://${this.baseUrl}`
			}, callback);
		}

		lookupPostcode(options: LookupPostcodeOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);

			const query = options.postcode;
			const cachedResponse = this.cache.getPostcodeQuery(query);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/postcodes/${encodeURIComponent(options.postcode)}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error && error.responseCode === 4040) return callback(null, [], xhr);
				if (error) return callback(error, null, xhr);
				this.cache.cachePostcodeQuery(query, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupAddress(options: LookupAddressOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			extend(queryString, constructAddressQuery(options));

			const query = options.query;
			const cachedResponse = this.cache.getAddressQuery(query);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/addresses`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheAddressQuery(query, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupAutocomplete(options: LookupAutocompleteOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			extend(queryString, constructAutocompleteQuery(options));

			const query = options.query;
			const cachedResponse = this.cache.getAutocompleteQuery(query);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/autocomplete/addresses`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheAutocompleteQuery(query, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupUdprn(options: LookupIdOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			const id = options.id;

			const cachedResponse = this.cache.getUdprnQuery(id);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/udprn/${id}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheUdprnQuery(id, data.result);
				return callback(null, data.result, xhr);
			});
		}

		lookupUmprn(options: LookupIdOptions, callback: XhrCallback): void {
			options.api_key = this.api_key;
			const headers = constructHeaders(options);
			const queryString = constructQuery(options);
			const id = options.id;

			const cachedResponse = this.cache.getUmprnQuery(id);
			if (cachedResponse) return callback(null, cachedResponse);

			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/umprn/${id}`,
				headers: headers,
				queryString: queryString
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				this.cache.cacheUmprnQuery(id, data.result);
				return callback(null, data.result, xhr);
			});
		}

		checkKeyUsability(callback: XhrCallback): void {
			IdealPostcodes.Transport.xhrRequest({
				url: `${this.apiUrl()}/keys/${this.api_key}`
			}, (error, data, xhr) => {
				if (error) return callback(error, null, xhr);
				return callback(null, data.result, xhr);
			});
		}

		autocompleteAddress(options: LookupAutocompleteOptions): void {
			this.debouncedAutocomplete(options);
		}

		registerAutocompleteCallback(callback: XhrCallback): void {
			this.autocompleteCallback = callback;
		}
	}
}
