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

		export const isIE = (navigator?: Navigator): number|boolean => {
			const nav = navigator ? navigator : window.navigator;
			try {
				const myNav = nav.userAgent.toLowerCase();
				return (myNav.indexOf("msie") !== -1) ? parseInt(myNav.split("msie")[1]) : false;
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

		export const constructHeaders = (headerOptions: IdealPostcodes.BasicOptions): { [key: string]: string } | {} => {
			const headers = {};
			headers["Authorization"] = constructAuthenticationHeader(headerOptions);
			return headers;
		};

		export const deconstructAuthenticationHeader = (authorizationHeader?: string): IdealPostcodes.BasicOptions => {
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

		export const constructAuthenticationHeader = (authOptions: IdealPostcodes.BasicOptions): string => {
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

		export const constructQueryString = (options: IdealPostcodes.BasicOptions): { [key: string]: string } | {} => {
			const queryString = {};
			if (options.filter) queryString["filter"] = options.filter.join(",");
			if (options.licensee) queryString["licensee"] = options.licensee;
			if (options.tags) queryString["tags"] = options.tags.join(",");
			return queryString;
		};

		export const constructAutocompleteQueryString = (options: LookupAutocompleteOptions): { [key: string]: string } | {} => {
			const queryString = {};
			queryString["query"] = options.query;
			if (options.limit) queryString["limit"] = options.limit;
			return queryString;
		};

		export const constructAddressQueryString = (options: LookupAddressOptions): { [key: string]: string } | {} => {
			const queryString = {};
			queryString["query"] = options.query;
			queryString["page"] = options.page || 0;
			queryString["limit"] = options.limit || 10;
			return queryString;
		};
	}
}
