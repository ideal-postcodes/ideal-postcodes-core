"use strict";

const Cache = IdealPostcodes.Cache;

describe("Cache", () => {
	let cache;

	beforeEach(() => {
		cache = new Cache();
	});

	describe(".cacheAddressQuery", () => {
		it ("caches a query response", () => {
			cache.cacheAddressQuery({query: "foo"}, { bar: "baz" });
			expect(cache.getAddressQuery({query: "foo"}).bar).toEqual("baz");
			cache.cacheAddressQuery({query: "1", page: 0}, {page: "0"});
			cache.cacheAddressQuery({query: "1", page: 1}, {page: "1"});
			expect(cache.getAddressQuery({query: "1", page: 0}).page).toEqual("0");
			expect(cache.getAddressQuery({query: "1", page: 1}).page).toEqual("1");
		});
	});
	describe(".cachePostcodeQuery", () => {
		it ("caches a query response", () => {
			cache.cachePostcodeQuery({query: "foo"}, { bar: "baz" });
			expect(cache.getPostcodeQuery({query: "foo"}).bar).toEqual("baz");
			cache.cachePostcodeQuery({query: "1", page: 0}, {page: "0"});
			cache.cachePostcodeQuery({query: "1", page: 1}, {page: "1"});
			expect(cache.getPostcodeQuery({query: "1", page: 0}).page).toEqual("0");
			expect(cache.getPostcodeQuery({query: "1", page: 1}).page).toEqual("1");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheAutocompleteQuery({query: "foo"}, { bar: "baz" });
			expect(cache.getAutocompleteQuery({query: "foo"}).bar).toEqual("baz");
			cache.cacheAutocompleteQuery({query: "1", page: 0}, {page: "0"});
			cache.cacheAutocompleteQuery({query: "1", page: 1}, {page: "1"});
			expect(cache.getAutocompleteQuery({query: "1", page: 0}).page).toEqual("0");
			expect(cache.getAutocompleteQuery({query: "1", page: 1}).page).toEqual("1");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheUdprnQuery({query: 8}, { bar: "baz" });
			expect(cache.getUdprnQuery({query: 8}).bar).toEqual("baz");
			cache.cacheUdprnQuery({query: "1", page: 0}, {page: "0"});
			cache.cacheUdprnQuery({query: "1", page: 1}, {page: "1"});
			expect(cache.getUdprnQuery({query: 1, page: 0}).page).toEqual("0");
			expect(cache.getUdprnQuery({query: 1, page: 1}).page).toEqual("1");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheUmprnQuery({query: 8}, { bar: "baz" });
			expect(cache.getUmprnQuery({query: 8}).bar).toEqual("baz");
			cache.cacheUmprnQuery({query: "1", page: 0}, {page: "0"});
			cache.cacheUmprnQuery({query: "1", page: 1}, {page: "1"});
			expect(cache.getUmprnQuery({query: 1, page: 0}).page).toEqual("0");
			expect(cache.getUmprnQuery({query: 1, page: 1}).page).toEqual("1");
		});
	});
	describe(".getAddressQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getAddressQuery({query: "foo"})).toBeUndefined();
		});
	});
	describe(".getPostcodeQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getPostcodeQuery({query: "foo"})).toBeUndefined();
		});
	});
	describe(".getAutocompleteQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getAutocompleteQuery({query: "foo"})).toBeUndefined();
		});
	});
	describe(".getUdprnQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getUdprnQuery({query: 8})).toBeUndefined();
		});
	});
	describe(".getUmprnQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getUmprnQuery({query: 8})).toBeUndefined();
		});
	});
});
