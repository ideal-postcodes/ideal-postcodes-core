"use strict";

const Cache = IdealPostcodes.Cache;

describe("Cache", () => {
	let cache;

	beforeEach(() => {
		cache = new Cache();
	});

	describe(".cacheAddressQuery", () => {
		it ("caches a query response", () => {
			cache.cacheAddressQuery("foo", { bar: "baz" });
			expect(cache.getAddressQuery("foo").bar).toEqual("baz");
		});
	});
	describe(".cachePostcodeQuery", () => {
		it ("caches a query response", () => {
			cache.cachePostcodeQuery("foo", { bar: "baz" });
			expect(cache.getPostcodeQuery("foo").bar).toEqual("baz");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheAutocompleteQuery("foo", { bar: "baz" });
			expect(cache.getAutocompleteQuery("foo").bar).toEqual("baz");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheUdprnQuery(8, { bar: "baz" });
			expect(cache.getUdprnQuery(8).bar).toEqual("baz");
		});
	});
	describe(".cacheAutocompleteQuery", () => {
		it ("caches a query response", () => {
			cache.cacheUmprnQuery(8, { bar: "baz" });
			expect(cache.getUmprnQuery(8).bar).toEqual("baz");
		});
	});
	describe(".getAddressQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getAddressQuery("foo")).toBeUndefined();
		});
	});
	describe(".getPostcodeQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getPostcodeQuery("foo")).toBeUndefined();
		});
	});
	describe(".getAutocompleteQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getAutocompleteQuery("foo")).toBeUndefined();
		});
	});
	describe(".getUdprnQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getUdprnQuery(8)).toBeUndefined();
		});
	});
	describe(".getUmprnQuery", () => {
		it ("returns undefined if lookup not present", () => {
			expect(cache.getUmprnQuery(8)).toBeUndefined();
		});
	});
});
