"use strict";

describe("Integration", () => {
	describe(".ping", () => {
		beforeEach(installAjax);
		afterEach(uninstallAjax);
		it ("returns ping", done => {
			const client = new IdealPostcodes.Client({
				api_key: "iddqd"
			});
			client.ping((error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.code).toEqual(2000);
				const request = parseUrl(xhr.url);
				expect(request.path).toBeUndefined();
				done();
			});
			expectResponse(responses.ping);
		});
	});
});
