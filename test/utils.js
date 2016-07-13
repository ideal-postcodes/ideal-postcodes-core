"use strict";

describe("Utils", () => {
	describe(".extend", () => {
		it ("extends an object", () => {
			const target = {
				foo: "foo",
				baz: "baz"
			};
			const source = {
				bar: "bar",
				baz: "bazziest",
				quxx: "quxx"
			};
			const result = IdealPostcodes.Utils.extend(target, source);
			expect(result.foo).toBe("foo");
			expect(result.baz).toBe("bazziest");
			expect(result.quxx).toBe("quxx");
		});
	});

	describe(".debounce", () => {
		let debounce;

		beforeEach(() => {
			debounce = IdealPostcodes.Utils.debounce;
		});

		it ("debounces function", done => {
			let count = 0;
			const finish = () => {
				expect(count).toEqual(1);
				done();
			}
			const debouncedMethod = debounce(() => {
				count += 1;
				finish();
			});
			debouncedMethod();
			debouncedMethod();
			debouncedMethod();
		});
	});
});
