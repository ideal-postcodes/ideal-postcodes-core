namespace IdealPostcodes {
	export namespace Utils {
		// Credit to https://github.com/component/debounce
		export const now = () => Date.now();

		export const debounce = (func: any, delay: number = 100): any => {
			let timeout, args, context, timeInvoked, result;

			function later() {
				let timeSinceInvocation = now() - timeInvoked;
				if (timeSinceInvocation > 0 && timeSinceInvocation < delay) {
					timeout = setTimeout(later, delay - timeSinceInvocation);
				} else {
					timeout = null;
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				}
			};

			return function() {
				context = this;
				args = arguments;
				timeInvoked = now();
				if (!timeout) timeout = setTimeout(later, delay);
				return result;
			};
		};

		export const extend = (target: any, ...sources: any[]): any => {
			const length = sources.length;
			for (let i = 0; i < length; i++) {
				let source = sources[i];
				for (let key in source) {
					if (source[key] !== undefined) {
						target[key] = source[key];
					}
				}
			}
			return target;
		};
	}
}
