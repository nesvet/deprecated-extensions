const { now } = Date;
const timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;


Date.timezoneOffset = timezoneOffset;

Date.nowUTC = () => now() - timezoneOffset;
