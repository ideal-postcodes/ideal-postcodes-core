"use strict";

describe("Address Resource", () => {
	describe(".lookupAutocomplete", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("returns postcode lookup", done => {
			client.lookupAutocomplete({
				query: "10 downing"
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toBeGreaterThan(0);
				done();
			});
			expectResponse(responses.autocomplete.results);
		});
		it ("returns empty array results if no match", done => {
			client.lookupAutocomplete({
				query: "a"
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toEqual(0);
				done();
			});
			expectResponse(responses.autocomplete.noResults);
		});
		it ("returns error if invalid api key", done => {
			client = new IdealPostcodes.Client({ api_key: "bogus" });
			client.lookupAutocomplete({
				query: "10 downing",
			}, (error, response, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
				done();
			});
			expectResponse(responses.invalidKey);
		});
		it ("caches requests", done => {
			client.lookupAutocomplete({
				query: "10 downing",
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toBeGreaterThan(0);
				expect(xhr).toBeDefined();
				client.lookupAutocomplete({
					query: "10 downing",
				}, (error, response, xhr) => {
					expect(error).toBeNull();
					expect(response.hits.length).toBeGreaterThan(0);
					expect(xhr).not.toBeDefined();
					done();
				});
			});
			expectResponse(responses.autocomplete.results);
		});
	});
	describe("debounced autocomplete", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("debounces autocomplete calls", done => {
			let count = 0;
			client.registerAutocompleteCallback((error, data, xhr) => {
				expect(error).toBeNull();
				count += 1;
				expect(count).toEqual(1);
				expect(data.hits.length).toBeGreaterThan(0);
				done();
			});
			client.autocompleteAddress({ query: "10 downing" });
			client.autocompleteAddress({ query: "10 downing" });
			client.autocompleteAddress({ query: "10 downing" });
			setTimeout(() => {
				expectResponse(responses.autocomplete.results);
			}, 200);
		});
	});
});
