/// <reference path="../error/api.ts" />

namespace IdealPostcodes {
	export interface XhrCallback {
		(error: any, data: any, xhr?: XMLHttpRequest): void;
	}

	export namespace Transport {
		interface XhrOptions {
			url: string;
			method?: string;
			timeout?: number;
			data?: { [key: string]: string };
			headers?: { [key: string]: string } | {};
			queryString?: { [key: string]: string } | {};
		}

		export const getXhr = (): XMLHttpRequest => {
			try {
				return new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
			} catch (e) {
				return null;
			}
		};

		export const detectTls = (window: Window): boolean => {
			try {
				return window.location.protocol !== "http:";
			} catch (e) {
				return true;
			}
		};

		export const defaultHeaders = {
			"Accept": "text/javascript, application/javascript",
			// "X-Requested-With": "XMLHttpRequest"
		};

		export const generateQueryString = (query: {[key: string]: string} | {}): string => {
			const result = [];
			for (let key in query) {
				result.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
			}
			return result.join("&");
		};

		const blankRe = /^\s*$/;

		export const xhrRequest = (options: XhrOptions, callback: XhrCallback): XMLHttpRequest => {
			let url = options.url;
			const timeout = options.timeout || IdealPostcodes.DEFAULT_TIMEOUT;
			const data = options.data || null;
			const headers = IdealPostcodes.Utils.extend({}, defaultHeaders, options.headers || {});
			const method = options.method || "GET";

			const queryString = generateQueryString(options.queryString || {});
			if (queryString.length > 0) url += "?" + queryString;

			const xhr = getXhr();
			xhr.open(method, url, true);

			try {
				for (let attr in headers) {
					xhr.setRequestHeader(attr, headers[attr]);
				}
			} catch (e) { }

			const abortTimeout = setTimeout(() => {
				xhr.onreadystatechange = () => { };
				xhr.abort();
				callback(new Error("Request timeout"), null, xhr);
			}, timeout);

			xhr.onreadystatechange = function () {
				let result;
				if (xhr.readyState === 4) {
					clearTimeout(abortTimeout);

					if (xhr.status !== 200) {
						return callback(IdealPostcodes.Errors.parse(xhr), {}, xhr);
					}

					try {
						result = blankRe.test(xhr.responseText) ? {} : JSON.parse(xhr.responseText);
					} catch (e) {
						return callback(new Error("parsererror"), null, xhr);
					}

					return callback(null, result, xhr);
				}
			};

			xhr.send(data);

			return xhr;
		};
	}
}
