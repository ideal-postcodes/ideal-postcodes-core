/// <reference path="./utils.ts" />
/// <reference path="../index.ts" />
/// <reference path="../error/api.ts" />
/// <reference path="../utils/utils.ts" />

namespace IdealPostcodes {
	export namespace Transport {
		let jsonpCounter = 0;
		const noop = () => {};

		// Mock XHR interface for jsonp requests
		interface VirtualXhr extends XMLHttpRequest { }

		// Include callback name, any header authorisation, other querystring options
		const jsonpQueryString = (options: StrictXhrOptions, callbackName: string): string => {
			options.queryString["callback"] = callbackName;
			const headers = options.headers;
			const auth = deconstructAuthenticationHeader(headers["Authorization"]);
			IdealPostcodes.Utils.extend(options.queryString, auth);
			return generateQueryString(options.queryString);
		};

		const extractStatus = (apiResponse: ApiResponse): number => {
			const code = apiResponse.code;
			if (!code || typeof code !== "number") return 500;
			return parseInt(String(code).slice(0, 3));
		};

		export const jsonpRequest = (options: StrictXhrOptions, callback: XhrCallback): XMLHttpRequest => {
			jsonpCounter += 1;

			let url = options.url;

			// Reject non GET requests
			if (options.method && options.method.toLowerCase() !== "get") {
				callback(new Error("Browser is unable to perform non-GET requests"), null, null);
				return null;
			}

			// Generate callbackname
			const callbackName = `idpc_${IdealPostcodes.Utils.now()}_${jsonpCounter}`;

			// Configure querystring
			const queryString = jsonpQueryString(options, callbackName);
			if (queryString.length > 0) url += "?" + queryString;

			const target = document.getElementsByTagName("script")[0] || document.head;

			const timer = setTimeout(() => {
				cleanup();
				callback(new Error("Request timeout"), null, null);
			}, options.timeout);

			const cleanup = () => {
				if (script.parentNode) script.parentNode.removeChild(script);
				window[callbackName] = noop;
				if (timer) clearTimeout(timer);
			};

			const cancel = () => {
				if (window[callbackName]) cleanup();
			};

			window[callbackName] = (result: ApiResponse) => {
				cleanup();
				const status = extractStatus(result);
				const virtualXhr = {
					responseText: result,
					status: status
				};
				if (virtualXhr.status !== 200) {
					return callback(IdealPostcodes.Errors.parseErrorResponse(result, status), null, <VirtualXhr>virtualXhr);
				}
				return callback(null, result, <VirtualXhr>virtualXhr);
			};

			const script = document.createElement("script");
			script.src = url;
			script.type = "text/javascript";
			target.parentNode.insertBefore(script, target);

			return null;
		};
	}
}