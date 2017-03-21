"use strict";

describe("Address Resource", () => {
	describe(".lookupAddress", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("returns address lookup", done => {
			const query = "id11qd";
			client.lookupAddress({
				query: query
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.total).toBeGreaterThan(0);
				expect(response.page).toEqual(0);
				expect(response.limit).toEqual(10);
				expect(response.hits[0].postcode).toEqual("ID1 1QD");
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.addresses.results);
		});
		it ("returns empty array results if no match", done => {
			const query = "ID1KFA";
			client.lookupAddress({
				query: query
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.total).toEqual(0);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.addresses.noResults);
		});
		it ("filters results", done => {
			const query = "id11qd";
			client.lookupAddress({
				query: query,
				filter: ["line_1", "postcode"]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].line_1).toBeDefined();
				expect(addresses[0].postcode).toBeDefined();
				expect(Object.keys(addresses[0]).length).toEqual(2);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.filter).toEqual("line_1,postcode");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.addresses.filteredResults);
		});
		it ("restricts results by post_town", done => {
			const query = "10 downing street";
			const post_town = "london"
			client.lookupAddress({
				query: query,
				post_town: [post_town]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toEqual(2);
				addresses.forEach(address => 
					expect(address.post_town.toUpperCase())
						.toEqual(post_town.toUpperCase()));
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.post_town).toEqual(post_town);
				}
				done();
			});
			expectResponse(responses.addresses.postTownFilteredResult);
		});
		it ("restricts results by postcode_outward", done => {
			const query = "10 downing street";
			const postcode_outward = "sw1a"
			client.lookupAddress({
				query: query,
				postcode_outward: [postcode_outward]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toEqual(1);
				addresses.forEach(address => 
					expect(address.postcode_outward.toUpperCase())
						.toEqual(postcode_outward.toUpperCase()));
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.postcode_outward).toEqual(postcode_outward);
				}
				done();
			});
			expectResponse(responses.addresses.outwardFilteredResult);
		});
		it ("limits results", done => {
			const query = "10 high street";
			const limit = 1;
			client.lookupAddress({
				query: query,
				limit: limit
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.page).toEqual(0);
				expect(response.limit).toEqual(1);
				expect(response.hits.length).toEqual(1);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.limit).toEqual(limit.toString());
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.addresses.limitedResults);
		});
		it ("paginates results", done => {
			const query = "10 high street";
			const page = "1";
			client.lookupAddress({
				query: query,
				page: page
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.page).toEqual(1);
				expect(response.limit).toEqual(10);
				expect(response.hits.length).toEqual(10);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(request.query.page).toEqual(page);
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.addresses.paginatedResults);
		});
		// 401 responses buggy in some versions of IE10
		// http://stackoverflow.com/questions/16081267/xmlhttprequest-status-0-instead-of-401-in-ie-10
		it ("returns error if invalid api key", done => {
			const api_key = "bogus";
			const query = "ID11QD";
			client = new IdealPostcodes.Client({ api_key: api_key });
			client.lookupAddress({
				query: query,
			}, (error, addresses, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/addresses");
					expect(request.query.query).toEqual(query);
					expect(xhr.requestHeaders.Authorization).toContain(api_key);
				}
				done();
			});
			expectResponse(responses.invalidKey);
		});
		it ("caches requests", done => {
			client.lookupAddress({
				query: "ID11QD",
			}, (error, addresses, xhr) => {
				expect(error).toBeNull();
				expect(addresses.total).toBeGreaterThan(0);
				expect(client.cache.store.addressStore["query=ID11QD"]).toBeDefined();
				expect(xhr).toBeDefined();
				client.lookupAddress({
					query: "ID11QD",
				}, (error, addresses, xhr) => {
					expect(error).toBeNull();
					expect(addresses.total).toBeGreaterThan(0);
					expect(xhr).not.toBeDefined();
					done();
				});
			});
			expectResponse(responses.addresses.results);
		});
	});

	describe(".lookupUdprn", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("returns address", done => {
			client.lookupUdprn({
				id: 0
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(address.postcode).toEqual("ID1 1QD");
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/udprn/0");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.udprn.results);
		});
		it ("returns error if no match", done => {
			client.lookupUdprn({
				id: 8
			}, (error, address, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4044);
				expect(address).toBeNull();
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/udprn/8");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.udprn.noResults);
		});
		it ("filters results", done => {
			client.lookupUdprn({
				id: 0,
				filter: ["line_1", "postcode"]
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(address.line_1).toBeDefined();
				expect(address.postcode).toBeDefined();
				expect(Object.keys(address).length).toEqual(2);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/udprn/0");
					expect(request.query.filter).toEqual("line_1,postcode");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.udprn.filteredResults);
		});
		it ("caches requests", done => {
			client.lookupUdprn({
				id: 0,
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(xhr).toBeDefined();
				expect(client.cache.store.udprnStore["id=0"]).toBeDefined();
				client.lookupUdprn({
					id: 0,
				}, (error, addresses, xhr) => {
					expect(error).toBeNull();
					expect(xhr).not.toBeDefined();
					done();
				});
			});
			expectResponse(responses.udprn.results);
		});
	});

	describe(".lookupUmprn", () => {
		let client;

		beforeEach(() => {
			client = new IdealPostcodes.Client({ api_key: test_api_key });
			installAjax();
		});
		afterEach(uninstallAjax);

		it ("returns address", done => {
			client.lookupUmprn({
				id: 0
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(address.postcode).toEqual("ID1 1QD");
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/umprn/0");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.umprn.results);
		});
		it ("returns error if no match", done => {
			client.lookupUmprn({
				id: 8
			}, (error, address, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4046);
				expect(address).toBeNull();
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/umprn/8");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.umprn.noResults);
		});
		it ("filters results", done => {
			client.lookupUmprn({
				id: 0,
				filter: ["line_1", "postcode"]
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(address.line_1).toBeDefined();
				expect(address.postcode).toBeDefined();
				expect(Object.keys(address).length).toEqual(2);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/umprn/0");
					expect(request.query.filter).toEqual("line_1,postcode");
					expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				}
				done();
			});
			expectResponse(responses.umprn.filteredResults);
		});
		it ("caches requests", done => {
			client.lookupUmprn({
				id: 0,
			}, (error, address, xhr) => {
				expect(error).toBeNull();
				expect(xhr).toBeDefined();
				expect(client.cache.store.umprnStore["id=0"]).toBeDefined();
				client.lookupUmprn({
					id: 0,
				}, (error, addresses, xhr) => {
					expect(error).toBeNull();
					expect(xhr).not.toBeDefined();
					done();
				});
			});
			expectResponse(responses.umprn.results);
		});
	});
});
