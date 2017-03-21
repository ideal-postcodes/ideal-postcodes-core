/// <reference path="./utils.ts" />
/// <reference path="./xhr.ts" />
/// <reference path="./jsonp.ts" />
/// <reference path="../index.ts" />

namespace IdealPostcodes {
	export namespace Transport {
		export const defaultHeaders = {
			"Accept": "text/javascript, application/javascript"
		};

		export const request = (options: XhrOptions, callback: XhrCallback): XMLHttpRequest => {
			const strictOptions: StrictXhrOptions = {
				url: options.url,
				method: options.method || "GET",
				headers: options.headers || {},
				queryString: options.queryString || {},
				timeout: options.timeout || IdealPostcodes.DEFAULT_TIMEOUT,
				data: options.data || null
			};
			IdealPostcodes.Utils.extend(strictOptions.headers, defaultHeaders);

			// If legacy (<IE9, <Opera12, fallback to jsonp)
			if (legacyBrowser()) return jsonpRequest(strictOptions, callback);
			// Otherwise proceed with XMLHttpRequest
			return xhrRequest(strictOptions, callback);
		};
	}
}
