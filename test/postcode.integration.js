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
			client.lookupPostcode({
				postcode: "ID11QD"
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].postcode).toEqual("ID1 1QD");
				done();
			});
			expectResponse(responses.postcodes.results);
		});
		it ("returns empty array if no results", done => {
			client.lookupPostcode({
				postcode: "ID1KFA"
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toEqual(0);
				done();
			});
			expectResponse(responses.postcodes.noResults);
		});
		it ("filters results", done => {
			client.lookupPostcode({
				postcode: "ID11QD",
				filter: ["line_1", "postcode"]
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].line_1).toBeDefined();
				expect(addresses[0].postcode).toBeDefined();
				expect(Object.keys(addresses[0]).length).toEqual(2);
				done();
			});
			expectResponse(responses.postcodes.filteredResults);
		});
		it ("returns error if invalid api key", done => {
			client = new IdealPostcodes.Client({ api_key: "bogus" });
			client.lookupPostcode({
				postcode: "ID11QD",
			}, (error, addresses, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
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
