/// <reference path="ajax/xhr.ts" />

namespace IdealPostcodes {
	export const API_URL = "api.ideal-postcodes.co.uk";
	export const TLS = true;
	export const VERSION = "v1";
	export const DEFAULT_TIMEOUT = 10000;
	/* 
	 * Forces authorization header usage on autocomplete API which
	 * increases latency due to overhead OPTIONS request
	 */
	export const STRICT_AUTHORISATION = false;
}

window["IdealPostcodes"] = IdealPostcodes;
