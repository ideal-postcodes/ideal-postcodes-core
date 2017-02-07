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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(request.query.filter).toEqual("line_1,postcode");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				done();
			});
			expectResponse(responses.addresses.filteredResults);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(request.query.limit).toEqual(limit.toString());
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(request.query.page).toEqual(page);
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
				done();
			});
			expectResponse(responses.addresses.paginatedResults);
		});
		it ("returns error if invalid api key", done => {
			const api_key = "bogus";
			const query = "ID11QD";
			client = new IdealPostcodes.Client({ api_key: api_key });
			client.lookupAddress({
				query: query,
			}, (error, addresses, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/addresses");
				expect(request.query.query).toEqual(query);
				expect(xhr.requestHeaders.Authorization).toContain(api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/udprn/0");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/udprn/8");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/udprn/0");
				expect(request.query.filter).toEqual("line_1,postcode");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/umprn/0");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/umprn/8");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
				const request = parseUrl(xhr.url);
				expect(request.path).toEqual("v1/umprn/0");
				expect(request.query.filter).toEqual("line_1,postcode");
				expect(xhr.requestHeaders.Authorization).toContain(test_api_key);
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
