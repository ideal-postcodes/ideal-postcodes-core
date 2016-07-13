"use strict";

const XhrUtils = IdealPostcodes.XhrUtils;
const constructHeaders = XhrUtils.constructHeaders;
const constructAuthenticationHeader = XhrUtils.constructAuthenticationHeader;
const constructQueryString = XhrUtils.constructQueryString;
const constructAutocompleteQueryString = XhrUtils.constructAutocompleteQueryString;
const constructAddressQueryString = XhrUtils.constructAddressQueryString;

describe("XhrUtils", () => {
	describe(".constructHeaders", () => {
		it ("adds authorization to headers", () => {
			const headers = constructHeaders({
				api_key: "foo"
			});
			expect(headers["Authorization"]).toEqual('IDEALPOSTCODES api_key="foo"');
		});
		it ("returns empty string if no authorization", () => {
			const headers = constructHeaders({});
			expect(headers["Authorization"]).toEqual("");
		});
	});

	describe(".constructAuthenticationHeader", () => {
		it ("returns authorization header string", () => {
			const result = constructAuthenticationHeader({
				api_key: "foo"
			});
			expect(result).toEqual('IDEALPOSTCODES api_key="foo"');
		});
		it ("returns empty string if no valid authorization credentials provided", () => {
			const result = constructAuthenticationHeader({});
			expect(result).toEqual("");
		});
	});

	describe(".constructQueryString", () => {
		let queryString;
		beforeEach(() => {
			queryString = constructQueryString({
				filter: ["foo","bar"],
				licensee: "baz",
				tags: ["quux", "hoge"]
			});
		});
		it ("adds filter to querystring", () => {
			expect(queryString.filter).toEqual("foo,bar");
		});
		it ("adds licensee to querystring", () => {
			expect(queryString.licensee).toEqual("baz");
		});
		it ("adds tags to querystring", () => {
			expect(queryString.tags).toEqual("quux,hoge");
		});
	});

	describe(".constructAutocompleteQueryString", () => {
		it ("adds query to querystring", () => {
			const queryString = constructAutocompleteQueryString({
				query: "foo"
			});
			expect(queryString.query).toEqual("foo");
		});
	});

	describe(".constructAddressQueryString", () => {
		let queryString;
		beforeEach(() => {
			queryString = constructAddressQueryString({
				page: 8,
				limit: 88,
				query: "foo"
			})
		});
		it ("returns page in querystring", () => {
			expect(queryString.page).toEqual(8);
		});
		it ("returns limit in querystring", () => {
			expect(queryString.limit).toEqual(88);
		});
		it ("returns query in querystring", () => {
			expect(queryString.query).toEqual("foo");
		});
	});
});
