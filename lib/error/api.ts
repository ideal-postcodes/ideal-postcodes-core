/// <reference path="../index.ts" />
/// <reference path="./standard.ts" />

namespace IdealPostcodes {
	export namespace Errors {
		interface ApiErrorOptions extends ErrorOptions {
			status?: number;
			responseCode?: number;
		}

		export const parse = (xhr: XMLHttpRequest): IdealPostcodesError | void => {
			const status = xhr.status;
			if (status === 200) return;

			switch (status) {
				case 503:
					return new RateLimitError();
			}

			try {
				return parseErrorResponse(JSON.parse(xhr.responseText), status);
			} catch (e) {
				return new JsonParseError();
			}
		};

		export const parseErrorResponse = (response: ApiResponse, status: number): IdealPostcodesError | void => {
			const responseCode: number = response.code;
			const message: string = response.message;

			if (responseCode === undefined || message === undefined) return new GenericApiError();

			return new IdealPostcodesApiError({
				responseCode: responseCode,
				status: status,
				message: message
			});
		};

		export class IdealPostcodesApiError extends IdealPostcodesError {
			public status: number;
			public responseCode: number;

			constructor(options: ApiErrorOptions) {
				super(options);
				if (options.status) this.status = options.status;
				if (options.responseCode) this.responseCode = options.responseCode;
			}
		}

		export class RateLimitError extends IdealPostcodesApiError {
			constructor() {
				super({
					status: 503,
					message: "Rate Limit Reached. Please wait a while before you retry your request"
				});
			}
		}

		export class RequestTimeoutError extends IdealPostcodesApiError {
			constructor() {
				super({
					message: "Request timed out"
				});
			}
		}

		export class GenericApiError extends IdealPostcodesApiError {
			constructor() {
				super({
					message: "Unknown AJAX error occurred when accessing API"
				});
			}
		}
	}
}
