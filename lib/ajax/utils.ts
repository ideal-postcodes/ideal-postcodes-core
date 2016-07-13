/// <reference path="../client/client.ts" />

namespace IdealPostcodes {
	export namespace XhrUtils {
		export const AllowedAuthorizationParameters = ["api_key"];

		export const constructHeaders = (headerOptions: IdealPostcodes.BasicOptions): { [key: string]: string } | {} => {
			const headers = {};
			headers["Authorization"] = constructAuthenticationHeader(headerOptions);
			return headers;
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
