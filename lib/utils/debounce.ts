namespace IdealPostcodes {
	export namespace Utils {
		// Credit to https://github.com/component/debounce
		const now = () => Date.now();

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
	}
}
