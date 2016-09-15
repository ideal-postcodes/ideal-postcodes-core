"use strict";

const Transport = IdealPostcodes.Transport;
const constructHeaders = Transport.constructHeaders;
const deconstructAuthenticationHeader = Transport.deconstructAuthenticationHeader;
const constructAuthenticationHeader = Transport.constructAuthenticationHeader;
const constructQueryString = Transport.constructQueryString;
const constructAutocompleteQueryString = Transport.constructAutocompleteQueryString;
const constructAddressQueryString = Transport.constructAddressQueryString;
const isIE = Transport.isIE;

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

	describe(".isIE", () => {
		it ("returns IE version", () => {
			expect(isIE({userAgent: `Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; 
				Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; 
				.NET CLR 3.0.30729; .NET4.0C; .NET4.0E)`})).toEqual(9);
		});
		it ("returns false if not IE", () => {
			expect(isIE({userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) 
				AppleWebKit/537.36 (KHTML, like Gecko) 
				Chrome/52.0.2743.116 Safari/537.36`})).toEqual(false);
		});
	})

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

	describe(".deconstructAuthenticationHeader", () => {
		it ("deconstructs api_key", () => {
			const result = deconstructAuthenticationHeader('IDEALPOSTCODES api_key="foo"');
			expect(result["api_key"]).toEqual("foo");
		});
		it ("deconstructs any other authorization elements", () => {
			const result = deconstructAuthenticationHeader('IDEALPOSTCODES licensee="bar"');
			expect(result["licensee"]).toEqual("bar");
		});
		it ("returns empty object if no authorization header passed", () => {
			const result = deconstructAuthenticationHeader();
			expect(Object.keys(result).length).toEqual(0);
		});
		it ("returns empty object if invalid authorization header passed", () => {
			const result = deconstructAuthenticationHeader("foobar");
			expect(Object.keys(result).length).toEqual(0);
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
