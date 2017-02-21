"use strict";

describe("Client", () => {
	describe("Transport", () => {
		if (!IdealPostcodes.Transport.isIE() || IdealPostcodes.Transport.isIE() > 9) {
			describe("xhrRequest", () => {
				it ("executes XHR request", done => {
					IdealPostcodes.Transport.xhrRequest({
						url: "http://api.ideal-postcodes.co.uk/"
					}, (error, response, xhr) => {
						if (error) return done(error);
						expect(response.code).toEqual(2000);
						done();
					});
				});
				describe("Mocked requests", () => {
					beforeEach(() => {
						jasmine.Ajax.install();
					});

					afterEach(() => {
						jasmine.Ajax.uninstall();
					});

					it ("appends queryString to url", () => {
						IdealPostcodes.Transport.xhrRequest({
							url: "http://api.ideal-postcodes.co.uk/",
							queryString: {
								foo: "bar"
							}
						}, () => {});	
						const xhr = jasmine.Ajax.requests.mostRecent();
						expect(xhr.url).toEqual("http://api.ideal-postcodes.co.uk/?foo=bar");
					});
					it ("attaches custom request headers", () => {
						IdealPostcodes.Transport.xhrRequest({
							url: "http://api.ideal-postcodes.co.uk/",
							headers: {
								foo: "bar"
							}
						}, () => {});	
						const xhr = jasmine.Ajax.requests.mostRecent();
						expect(xhr.requestHeaders.foo).toEqual("bar");
					});
				});
			});
			describe("getXhr", () => {
				it ("returns XMLHttpRequest instance", () => {
					const instance = IdealPostcodes.Transport.getXhr();
					expect(instance.onreadystatechange).toBeDefined();
				});
			});
		}
	});

	describe("generateQueryString", () => {
		it ("converts object into escaped query string", () => {
			const input = {
				key: "value",
				"foo bar": "baz quux"
			};
			const expected = "key=value&foo%20bar=baz%20quux";
			expect(IdealPostcodes.Transport.generateQueryString(input)).toEqual(expected);
		});
	});

	describe("detectTls", () => {
		it ("returns true if loaded from https", () => {
			expect(IdealPostcodes.Transport.detectTls({
				location: {
					protocol: "https:"
				}
			})).toBe(true);
		});
		it ("returns false loaded from http", () => {
			expect(IdealPostcodes.Transport.detectTls({
				location: {
					protocol: "http:"
				}
			})).toBe(false);
		});
		it ("returns true for anything else", () => {
			expect(IdealPostcodes.Transport.detectTls({
				location: {
					protocol: "anything else"
				}
			})).toBe(true);
		});
		it ("returns true if error", () => {
			expect(IdealPostcodes.Transport.detectTls("bogus")).toBe(true);
		});
	});

	describe("#apiUrl", () => {
		it ("returns api url", () => {
			const client = new IdealPostcodes.Client({ tls: true });
			expect(client.apiUrl()).toEqual("https://api.ideal-postcodes.co.uk/v1");
		});

		it ("composes url from baseUrl and version", () => {
			const client = new IdealPostcodes.Client({
				tls: true,
				baseUrl: "foo",
				version: "bar"
			});
			expect(client.apiUrl()).toEqual("https://foo/bar");
		});
	});
});
