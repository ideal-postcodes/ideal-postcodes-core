"use strict";

describe("Key Resource", () => {
	describe(".checkKeyUsability", () => {
		beforeEach(installAjax);
		afterEach(uninstallAjax);
		it ("returns true for usable api key", done => {
			const api_key = "iddqd";
			const client = new IdealPostcodes.Client({ api_key: api_key });
			client.checkKeyUsability({}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.available).toEqual(true);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/keys/" + api_key);
				}
				done();
			});
			expectResponse(responses.keys.usable);
		});
		it ("returns false for unusable api key", done => {
			const api_key = "idkfa";
			const client = new IdealPostcodes.Client({ api_key: api_key });
			client.checkKeyUsability({}, (error, response, xhr) => {
				expect(error).toBeNull();
				expect(response.available).toEqual(false);
				if (stubAjax) {
					const request = parseUrl(xhr.url);
					expect(request.path).toEqual("v1/keys/" + api_key);
				}
				done();
			});
			expectResponse(responses.keys.notUsable);
		});
	});
});
