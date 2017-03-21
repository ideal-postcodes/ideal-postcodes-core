"use strict";

describe("Postcode Resource", () => {
	describe(".lookupPostcode", () => {
		let client;
		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);
		
		it ("returns postcode lookup", done => {
			const postcode = "ID11QD";
			client.lookupPostcode({
				postcode: postcode
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].postcode).toEqual("ID1 1QD");
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/postcodes/" + encodeURIComponent(postcode));
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.postcodes.results);
		});
		it ("returns empty array if no results", done => {
			const postcode = "ID1KFA";
			client.lookupPostcode({
				postcode: postcode
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toEqual(0);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/postcodes/" + encodeURIComponent(postcode));
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.postcodes.noResults);
		});
		it ("filters results", done => {
			const postcode = "ID11QD";
			client.lookupPostcode({
				postcode: postcode,
				filter: ["line_1", "postcode"]
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].line_1).toBeDefined();
				expect(addresses[0].postcode).toBeDefined();
				expect(Object.keys(addresses[0]).length).toEqual(2);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/postcodes/" + encodeURIComponent(postcode));
					expect(request.query.filter).toEqual("line_1,postcode");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.postcodes.filteredResults);
		});
		// 401 responses buggy in some versions of IE10
		// http://stackoverflow.com/questions/16081267/xmlhttprequest-status-0-instead-of-401-in-ie-10
		it ("returns error if invalid api key", done => {
			const api_key = "bogus";
			client = new IdealPostcodes.Client({ api_key: api_key });
			const postcode = "ID11QD";
			client.lookupPostcode({
				postcode: postcode,
			}, (error, addresses, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/postcodes/" + encodeURIComponent(postcode));
					expect(xhr.requestHeaders.Authorization).toContain(api_key);
				}
				done();
			});
			expectResponse(responses.invalidKey);
		});
		it ("caches requests", done => {
			client.lookupPostcode({
				postcode: "ID11QD",
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toBeGreaterThan(0);
				expect(client.cache.store.postcodeStore["postcode=ID11QD"]).toBeDefined();
				expect(xhr).toBeDefined();
				client.lookupPostcode({
					postcode: "ID11QD",
				}, (error, addresses, xhr) => {
					expect(error).toBeNull();
					expect(addresses.length).toBeGreaterThan(0);
					expect(xhr).not.toBeDefined();
					done();
				});
			});
			expectResponse(responses.postcodes.results);
		});
	});
});
