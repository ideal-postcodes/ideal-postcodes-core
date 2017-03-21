/// <reference path="../index.ts" />

namespace IdealPostcodes {
	export namespace Transport {
		export const blankRe = /^\s*$/;

		export const AllowedAuthorizationParameters = ["api_key"];

		export const detectTls = (window: Window): boolean => {
			try {
				return window.location.protocol !== "http:";
			} catch (e) {
				return true;
			}
		};

		export const legacyBrowser = (w?: Window): boolean => {
			const ieVersion = isIE(w);
			const operaVersion = isOpera(w);
			return !!(ieVersion && ieVersion <= 9) || !!(operaVersion && operaVersion <= 12);
		};

		export const isIE = (w?: Window): number|boolean => {
			const nav = w ? w.navigator : window.navigator;
			try {
				const myNav = nav.userAgent.toLowerCase();
				return (myNav.indexOf("msie") !== -1) ? parseInt(myNav.split("msie")[1]) : false;
			} catch (e) {
				return false;
			}
		};

		interface Opera {
			version: () => string;
		}

		interface OperaWindow extends Window {
			opera?: Opera;
		}

		export const isOpera = (w?: OperaWindow): number|boolean => {
			const opera = w ? w.opera : window["opera"];
			if (!opera) return false;
			if (Object.prototype.toString.call(opera) !== "[object Opera]") return false;
			try {
				const version = parseInt(opera.version(), 10);
				if (isNaN(version)) return false;
				return version;
			} catch (e) {
				return false;
			}
		};

		export const generateQueryString = (query: {[key: string]: string} | {}): string => {
			const result = [];
			for (let key in query) {
				result.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
			}
			return result.join("&");
		};

		export const constructHeaders = (headerOptions: BasicOptions): QueryStringObject | {} => {
			const headers = {};
			headers["Authorization"] = constructAuthenticationHeader(headerOptions);
			return headers;
		};

		export const deconstructAuthenticationHeader = (authorizationHeader?: string): BasicOptions => {
			const result = {};
			if (!authorizationHeader) return result;
			authorizationHeader
				.replace("IDEALPOSTCODES ", "")
				.trim()
				.split(" ")
				.forEach(elem => {
					let e = elem.split("=");
					if (typeof e[0] === "string" && typeof e[1] === "string") {
						result[e[0]] = e[1].replace(/(^"|"$)/g, "");
					}
				});
			return result;
		};

		export const constructAuthenticationHeader = (authOptions: BasicOptions): string => {
			const authorizationHeader = [];
			for (let i = 0; i < AllowedAuthorizationParameters.length; i++) {
				let param = AllowedAuthorizationParameters[i];
				if (authOptions[param] !== undefined) {
					authorizationHeader.push(`${param}="${authOptions[param]}"`);
				}
			}
			if (authorizationHeader.length === 0) return "";
			return `IDEALPOSTCODES ${authorizationHeader.join(" ")}`;
		};

		export const constructQueryString = (options: BasicOptions): QueryStringObject => {
			const queryString = {};
			if (options.filter) queryString["filter"] = options.filter.join(",");
			if (options.licensee) queryString["licensee"] = options.licensee;
			if (options.tags) queryString["tags"] = options.tags.join(",");
			return queryString;
		};

		export const constructAutocompleteQueryString = (options: LookupAutocompleteOptions): QueryStringObject => {
			const queryString = {};
			queryString["query"] = options.query;
			if (options.limit) queryString["limit"] = options.limit;
			if (options.postcode_outward) {
				queryString["postcode_outward"] = options.postcode_outward.join(",");
			}
			if (options.post_town) {
				queryString["post_town"] = options.post_town.join(",");
			}
			return queryString;
		};

		export const constructAddressQueryString = (options: LookupAddressOptions): QueryStringObject => {
			const queryString = {};
			queryString["query"] = options.query;
			queryString["page"] = options.page || 0;
			queryString["limit"] = options.limit || 10;
			if (options.postcode_outward) {
				queryString["postcode_outward"] = options.postcode_outward.join(",");
			}
			if (options.post_town) {
				queryString["post_town"] = options.post_town.join(",");
			}
			return queryString;
		};
	}
}
