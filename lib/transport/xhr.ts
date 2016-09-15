/// <reference path="./utils.ts" />
/// <reference path="../index.ts" />
/// <reference path="../error/api.ts" />
/// <reference path="../utils/utils.ts" />

namespace IdealPostcodes {
	export namespace Transport {
		export const getXhr = (): XMLHttpRequest => {
			try {
				return new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
			} catch (e) {
				return null;
			}
		};

		export const xhrRequest = (options: StrictXhrOptions, callback: XhrCallback): XMLHttpRequest => {
			let url = options.url;

			const queryString = generateQueryString(options.queryString);
			if (queryString.length > 0) url += "?" + queryString;

			const xhr = getXhr();
			xhr.open(options.method, url, true);

			try {
				for (let attr in options.headers) {
					xhr.setRequestHeader(attr, options.headers[attr]);
				}
			} catch (e) { }

			const abortTimeout = setTimeout(() => {
				xhr.onreadystatechange = () => { };
				xhr.abort();
				callback(new Error("Request timeout"), null, xhr);
			}, options.timeout);

			xhr.onreadystatechange = function () {
				let result: ApiResponse;

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

			xhr.send(options.data);

			return xhr;
		};
	}
}
