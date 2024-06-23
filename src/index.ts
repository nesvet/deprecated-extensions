//#if _SERVER
import { basedir } from "./basedir";
//#endif
import { noop as _noop } from "./noop";
import { pass as _pass } from "./pass";
import "./Array";
import "./Date";
import "./Map";
import "./Math.ts";
import "./Object";
import "./Set";


type GlobalExtension = {
	__basedir: string;
};

declare global {
	const window: GlobalExtension & Record<string, unknown>;
	var __basedir: string;// eslint-disable-line no-var
	var noop: typeof _noop;// eslint-disable-line no-var
	var pass: typeof _pass;// eslint-disable-line no-var
}


const _global = typeof global == "undefined" ? window : global;

//#if _SERVER
/** @deprecated */
_global.__basedir = basedir;
//#endif

/** @deprecated */
_global.noop = _noop;

/** @deprecated */
_global.pass = _pass;
