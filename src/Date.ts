const { now } = Date;
const timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;


declare global {
	interface DateConstructor {
		
		/** @deprecated */
		nowUTC(): number;
		
		/** @deprecated */
		timezoneOffset: number;
		
	}
}


Date.timezoneOffset = timezoneOffset;

Date.nowUTC = () => now() - timezoneOffset;
