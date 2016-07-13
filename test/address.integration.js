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
			client.lookupAddress({
				query: "id11qd"
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.total).toBeGreaterThan(0);
				expect(response.page).toEqual(0);
				expect(response.limit).toEqual(10);
				expect(response.hits[0].postcode).toEqual("ID1 1QD");
				done();
			});
			expectResponse(responses.addresses.results);
		});
		it ("returns empty array results if no match", done => {
			client.lookupAddress({
				query: "ID1KFA"
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.total).toEqual(0);
				done();
			});
			expectResponse(responses.addresses.noResults);
		});
		it ("filters results", done => {
			client.lookupAddress({
				query: "id11qd",
				filter: ["line_1", "postcode"]
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				const addresses = response.hits;
				expect(addresses.length).toBeGreaterThan(0);
				expect(addresses[0].line_1).toBeDefined();
				expect(addresses[0].postcode).toBeDefined();
				expect(Object.keys(addresses[0]).length).toEqual(2);
				done();
			});
			expectResponse(responses.addresses.filteredResults);
		});
		it ("limits results", done => {
			client.lookupAddress({
				query: "10 high street",
				limit: 1
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.page).toEqual(0);
				expect(response.limit).toEqual(1);
				expect(response.hits.length).toEqual(1);
				done();
			});
			expectResponse(responses.addresses.limitedResults);
		});
		it ("paginates results", done => {
			client.lookupAddress({
				query: "10 high street",
				page: 1
			}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.page).toEqual(1);
				expect(response.limit).toEqual(10);
				expect(response.hits.length).toEqual(10);
				done();
			});
			expectResponse(responses.addresses.paginatedResults);
		});
		it ("returns error if invalid api key", done => {
			client = new IdealPostcodes.Client({ api_key: "bogus" });
			client.lookupAddress({
				query: "ID11QD",
			}, (error, addresses, xhr) => {
				expect(error).not.toBeNull();
				expect(error.responseCode).toEqual(4010);
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
