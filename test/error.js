"use strict";

const Errors = IdealPostcodes.Errors;

describe("Error", () => {
	describe("StandardError", () => {
		describe("IdealPostcodesError", () => {
			it ("prepends message", () => {
				const error = new Errors.IdealPostcodesError({
					message: "Foo"
				});
				expect(error.message).toEqual("Ideal Postcodes Error: Foo");
			});
		});
		describe("ParseError", () => {
			it ("returns correct error", () => {
				const error = new Errors.JsonParseError();
				expect(error.message).toEqual("Ideal Postcodes Error: Unable to parse JSON response");
			});
		});
	});
	describe("ApiErrors", () => {
		describe(".parse", () => {
			it ("detects rate limit errors", () => {
				const xhr = {
					status: 503
				};
				const error = Errors.parse(xhr);
				expect(error.status).toEqual(503);
			});
			it ("returns generic error if invalid JSON provided in response body", () => {
				const xhr = {
					status: 400,
					responseText: "}{"
				};
				const error = Errors.parse(xhr);
				expect(error.message).toContain("Unable to parse JSON response");
			});
			it ("returns generic error if empty message", () => {
				const xhr = {
					status: 400,
					responseText: JSON.stringify({
						code: 4000
					})
				};
				const error = Errors.parse(xhr);
				expect(error.message).toEqual("Ideal Postcodes Error: Unknown AJAX error occurred when accessing API");
			});
			it ("returns generic error if empty response code", () => {
				const xhr = {
					status: 400,
					responseText: JSON.stringify({
						message: "Foo"
					})
				};
				const error = Errors.parse(xhr);
				expect(error.message).toEqual("Ideal Postcodes Error: Unknown AJAX error occurred when accessing API");
			});
			it ("returns error as defined by error response", () => {
				const xhr = {
					status: 400,
					responseText: JSON.stringify({
						message: "Foo",
						code: 4000
					})
				};
				const error = Errors.parse(xhr);
				expect(error.message).toEqual("Ideal Postcodes Error: Foo");
				expect(error.responseCode).toEqual(4000);
				expect(error.status).toEqual(400);
			});
		});
		describe("IdealPostcodesApiError", () => {
			let error;
			beforeAll(() => {
				error = new Errors.IdealPostcodesApiError({
					status: 8,
					message: "Foo",
					responseCode: 88
				});
			})
			it ("has a responseCode attribute", () => {
				expect(error.status).toEqual(8);
			});
			it ("has a http status code attribute", () => {
				expect(error.responseCode).toEqual(88);
			});
		});
		describe("RateLimitError", () => {
			it ("returns correct error", () => {
				const error = new Errors.RateLimitError();
				expect(error.status).toEqual(503);
			});
		});

		describe("RequestTimeoutError", () => {
			it ("returns correct error", () => {
				const error = new Errors.RequestTimeoutError();
				expect(error.message).toEqual("Ideal Postcodes Error: Request timed out");
			});
		});

		describe("GenericApiError", () => {
			it ("returns correct error", () => {
				const error = new Errors.GenericApiError();
				expect(error.message).toEqual("Ideal Postcodes Error: Unknown AJAX error occurred when accessing API");
			});
		});
	});
});
