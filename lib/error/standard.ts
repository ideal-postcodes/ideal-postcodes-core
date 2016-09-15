/// <reference path="../index.ts" />

namespace IdealPostcodes {
	export namespace Errors {
		export interface ErrorOptions {
			message: string;
		}

		export class IdealPostcodesError extends Error {
			constructor(options: ErrorOptions) {
				super();
				this.message = `Ideal Postcodes Error: ${options.message}`;
			}
		}

		export class JsonParseError extends IdealPostcodesError {
			constructor() {
				super({
					message: "Unable to parse JSON response"
				});
			};
		}
	}
}
