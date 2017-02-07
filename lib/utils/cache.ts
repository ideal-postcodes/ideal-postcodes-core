/// <reference path="../index.ts" />

namespace IdealPostcodes {
	const cacheArguments = [
		"query",
		"limit",
		"page",
		"post_town",
		"postcode_outward",
		"filter"
	];

	const generateCacheId = (qs: QueryStringObject): string => {
		return cacheArguments.map(arg => [arg, qs[arg]])
			.filter(elem => elem[1] !== undefined)
			.map(elem => elem.join("="))
			.join("|");
	};

	export class Cache {
		protected store: ResponseStore;

		constructor() {
			this.store = {
				postcodeStore: {},
				addressStore: {},
				autocompleteStore: {},
				udprnStore: {},
				umprnStore: {}
			};
		}

		cacheAddressQuery(qs: QueryStringObject, response: Object): void {
			const id = generateCacheId(qs);
			this.store.addressStore[id] = response;
		}

		getAddressQuery(qs: QueryStringObject): Object|void {
			const id = generateCacheId(qs);
			return this.store.addressStore[id];
		}

		cachePostcodeQuery(qs: QueryStringObject, response: Object): void {
			const id = generateCacheId(qs);
			this.store.postcodeStore[id] = response;
		}

		getPostcodeQuery(qs: QueryStringObject): Object|void {
			const id = generateCacheId(qs);
			return this.store.postcodeStore[id];
		}

		cacheAutocompleteQuery(qs: QueryStringObject, response: Object): void {
			const id = generateCacheId(qs);
			this.store.autocompleteStore[id] = response;
		}

		getAutocompleteQuery(qs: QueryStringObject): Object|void {
			const id = generateCacheId(qs);
			return this.store.autocompleteStore[id];
		}

		cacheUdprnQuery(qs: QueryStringObject, response: Object): void {
			const id = generateCacheId(qs);
			this.store.udprnStore[id] = response;
		}

		getUdprnQuery(qs: QueryStringObject): Object | void {
			const id = generateCacheId(qs);
			return this.store.udprnStore[id];
		}

		cacheUmprnQuery(qs: QueryStringObject, response: Object): void {
			const id = generateCacheId(qs);
			this.store.umprnStore[id] = response;
		}

		getUmprnQuery(qs: QueryStringObject): Object | void {
			const id = generateCacheId(qs);
			return this.store.umprnStore[id];
		}
	}
}
