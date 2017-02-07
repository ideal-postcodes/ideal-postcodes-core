"use strict";

describe("Address Resource", () => {
	describe(".lookupAutocomplete", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("returns autocomplete response", done => {
			const query = "10 downing";
			client.lookupAutocomplete({
				query: query
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toBeGreaterThan(0);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.api_key).toEqual(test_api_key);
				}
				done();
			});
			expectResponse(responses.autocomplete.results);
		});
		it ("returns empty array results if no match", done => {
			const query = "a";
			client.lookupAutocomplete({
				query: query
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toEqual(0);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.api_key).toEqual(test_api_key);
				}
				done();
			});
			expectResponse(responses.autocomplete.noResults);
		});
		it ("returns error if invalid api key", done => {
			const query = "10 downing";
			client = new IdealPostcodes.Client({ api_key: "bogus" });
			client.lookupAutocomplete({
				query: query,
			}, (error, response, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.api_key).toEqual("bogus");
				}
				done();
			});
			expectResponse(responses.invalidKey);
		});
		it ("restricts results by post_town", done => {
			const query = "10 downing str";
			const post_town = "london"
			client.lookupAutocomplete({
				query: query,
				post_town: [post_town]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toEqual(2);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.post_town).toEqual(post_town);
				}
				done();
			});
			expectResponse(responses.addresses.postTownFilteredResult);
		});
		it ("restricts results by postcode_outward", done => {
			const query = "10 downing str";
			const postcode_outward = "sw1a"
			client.lookupAutocomplete({
				query: query,
				postcode_outward: [postcode_outward]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toEqual(1);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.postcode_outward).toEqual(postcode_outward);
				}
				done();
			});
			expectResponse(responses.addresses.outwardFilteredResult);
		});
		it ("limits suggestions", done => {
			const limit = 1;
			const query = "10 downing";
			client.lookupAutocomplete({
				query: query,
				limit: limit
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.hits.length).toEqual(1);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/autocomplete/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.limit).toEqual(limit.toString());
					expect(request.query.api_key).toEqual(test_api_key);
				}
				done();
			});
			expectResponse(responses.autocomplete.limitedResults);
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
