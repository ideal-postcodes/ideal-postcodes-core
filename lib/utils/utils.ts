namespace IdealPostcodes {
	export namespace Utils {
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
