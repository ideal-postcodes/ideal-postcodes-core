namespace IdealPostcodes {
	export const API_URL = "api.ideal-postcodes.co.uk";
	export const TLS = true;
	export const VERSION = "v1";
	export const DEFAULT_TIMEOUT = 10000;

	/*
	 * STRICT_AUTHORISATION forces authorization header usage on
	 * autocomplete API which increases latency due to overhead
	 * OPTIONS request
	 */
	export const STRICT_AUTHORISATION = false;

	export interface XhrCallback {
		(error: any, data: any, xhr?: XMLHttpRequest): void;
	}

	export interface AutocompleteXhrCallback {
		(error: any, data: any, xhr?: XMLHttpRequest, options?: LookupAutocompleteOptions): void;
	}

	export interface XhrOptions {
		url: string;
		method?: string;
		timeout?: number;
		data?: { [key: string]: string };
		headers?: { [key: string]: string } | {};
		queryString?: { [key: string]: string } | {};
	}

	export interface StrictXhrOptions {
		url: string;
		method: string;
		timeout: number;
		data: { [key: string]: string };
		headers: { [key: string]: string } | {};
		queryString: { [key: string]: string } | {};
	}

	export interface BasicOptions {
		api_key?: string;
		licensee?: string;
		filter?: [string];
		tags?: [string];
	}

	export interface QueryStringObject { [key: string]: string|number; }

	export interface LookupPostcodeOptions extends BasicOptions {
		postcode: string;
	}

	export interface LookupAddressOptions extends BasicOptions, SearchFilters {
		query: string;
		page?: number;
		limit?: number;
	}

	export interface SearchFilters {
		postcode_outward?: [string];
		post_town?: [string];
	}

	export interface LookupIdOptions extends BasicOptions {
		id: number;
	}

	export interface LookupAutocompleteOptions extends BasicOptions, SearchFilters {
		query: string;
		limit?: number;
	}

	export interface ClientOptions {
		tls?: boolean;
		api_key?: string;
		baseUrl?: string;
		version?: string;
		strictAuthorisation?: boolean;
	}

	export interface ApiResponse {
		code?: number;
		message?: string;
		result?: { string: any };
	}

	export interface ResponseStore {
		postcodeStore: Object;
		addressStore: Object;
		autocompleteStore: Object;
		udprnStore: Object;
		umprnStore: Object;
	}

	// Removes IdealPostcodes reference from window
	export const removeGlobalReference = (): void => {
		if (root && root["IdealPostcodes"]) {
			root["IdealPostcodes"] = undefined;
		}
	};
}

declare var module: any;
declare var define: any;
declare var exports: any;
declare var global: any;

/** Module exporting with thanks to github.com/lodash/lodash */
/** Detect free variable `global` from Node.js. */
const freeGlobal = typeof global === "object" && global && global.Object === Object && global;

/** Used as a reference to the global object. */
const root = freeGlobal || Function("return this")();

/** Detect free variable `exports`. */
const freeExports = typeof exports === "object" && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
const freeModule = freeExports && typeof module === "object" && module && !module.nodeType && module;

// Export for AMD
if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
	define(() => IdealPostcodes);
} else if (freeModule) {
	// Export for Node.js although this won't work without updating lib/transport
	freeModule.exports = IdealPostcodes;
	// Export for CommonJS support
	freeExports.IdealPostcodes = IdealPostcodes;
}

// Export to the global object
root.IdealPostcodes = IdealPostcodes;
