"use strict";

describe("Key Resource", () => {
	describe(".checkKeyUsability", () => {
		beforeEach(installAjax);
		afterEach(uninstallAjax);
		it ("returns true for usable api key", done => {
			const client = new IdealPostcodes.Client({ api_key: "iddqd" });
			client.checkKeyUsability((error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.available).toEqual(true);
				done();
			});
			expectResponse(responses.keys.usable);
		});
		it ("returns false for unusable api key", done => {
			const client = new IdealPostcodes.Client({ api_key: "idkfa" });
			client.checkKeyUsability((error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.available).toEqual(false);
				done();
			});
			expectResponse(responses.keys.notUsable);
		});
	});
});
