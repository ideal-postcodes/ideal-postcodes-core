/// <reference path="../index.ts" />

namespace IdealPostcodes {
	const cacheArguments = [
		"id",
		"postcode",
		"query",
		"limit",
		"page",
		"post_town",
		"postcode_outward",
		"filter"
	];

	const generateCacheId = (qs: BasicOptions): string => {
		return cacheArguments.map(arg => [arg, qs[arg]])
			.filter(elem => elem[1] !== undefined)
			.map(elem => elem.join("="))
			.join("|");
	};

	export class Cache {
		protected active: boolean;
		protected store: ResponseStore;

		constructor() {
			this.initialiseStore();
			this.active = true;
		}

		disable(): void {
			this.active = false;
		}

		enable(): void {
			this.active = true;
		}

		initialiseStore(): void {
			this.store = {
				postcodeStore: {},
				addressStore: {},
				autocompleteStore: {},
				udprnStore: {},
				umprnStore: {}
			};
		}

		cacheAddressQuery(options: LookupAddressOptions, response: Object): void {
			if (!this.active) return;
			const id = generateCacheId(options);
			this.store.addressStore[id] = response;
		}

		getAddressQuery(options: LookupAddressOptions): Object|void {
			if (!this.active) return;
			const id = generateCacheId(options);
			return this.store.addressStore[id];
		}

		cachePostcodeQuery(options: LookupPostcodeOptions, response: Object): void {
			if (!this.active) return;
			const id = generateCacheId(options);
			this.store.postcodeStore[id] = response;
		}

		getPostcodeQuery(options: LookupPostcodeOptions): Object|void {
			if (!this.active) return;
			const id = generateCacheId(options);
			return this.store.postcodeStore[id];
		}

		cacheAutocompleteQuery(options: LookupAutocompleteOptions, response: Object): void {
			if (!this.active) return;
			const id = generateCacheId(options);
			this.store.autocompleteStore[id] = response;
		}

		getAutocompleteQuery(options: LookupAutocompleteOptions): Object|void {
			if (!this.active) return;
			const id = generateCacheId(options);
			return this.store.autocompleteStore[id];
		}

		cacheUdprnQuery(options: LookupIdOptions, response: Object): void {
			if (!this.active) return;
			const id = generateCacheId(options);
			this.store.udprnStore[id] = response;
		}

		getUdprnQuery(options: LookupIdOptions): Object | void {
			if (!this.active) return;
			const id = generateCacheId(options);
			return this.store.udprnStore[id];
		}

		cacheUmprnQuery(options: LookupIdOptions, response: Object): void {
			if (!this.active) return;
			const id = generateCacheId(options);
			this.store.umprnStore[id] = response;
		}

		getUmprnQuery(options: LookupIdOptions): Object | void {
			if (!this.active) return;
			const id = generateCacheId(options);
			return this.store.umprnStore[id];
		}
	}
}
