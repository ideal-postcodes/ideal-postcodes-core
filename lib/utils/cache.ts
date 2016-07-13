namespace IdealPostcodes {
	export interface ResponseStore {
		postcodeStore: Object;
		addressStore: Object;
		autocompleteStore: Object;
		udprnStore: Object;
		umprnStore: Object;
	}

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

		cacheAddressQuery(query: string, response: Object): void {
			this.store.addressStore[query] = response;
		}

		getAddressQuery(query: string): Object|void {
			return this.store.addressStore[query];
		}

		cachePostcodeQuery(query: string, response: Object): void {
			this.store.postcodeStore[query] = response;
		}

		getPostcodeQuery(query: string): Object|void {
			return this.store.postcodeStore[query];
		}

		cacheAutocompleteQuery(query: string, response: Object): void {
			this.store.autocompleteStore[query] = response;
		}

		getAutocompleteQuery(query: string): Object|void {
			return this.store.autocompleteStore[query];
		}

		cacheUdprnQuery(query: number, response: Object): void {
			this.store.udprnStore[query] = response;
		}

		getUdprnQuery(query: number): Object | void {
			return this.store.udprnStore[query];
		}

		cacheUmprnQuery(query: number, response: Object): void {
			this.store.umprnStore[query] = response;
		}

		getUmprnQuery(query: number): Object | void {
			return this.store.umprnStore[query];
		}
	}
}
