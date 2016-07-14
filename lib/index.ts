/// <reference path="ajax/xhr.ts" />

namespace IdealPostcodes {
	export const API_URL = "api.ideal-postcodes.co.uk";
	export const TLS = true;
	export const VERSION = "v1";
	export const DEFAULT_TIMEOUT = 10000;
}

window["IdealPostcodes"] = IdealPostcodes;
