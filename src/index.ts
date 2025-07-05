import { noop as _noop } from "./noop";
import { pass as _pass } from "./pass";
import "./Array";
import "./Date";
import "./Map";
import "./Math.ts";
import "./Object";
import "./Set";


declare global {
	const window: Record<string, unknown>;
	var noop: typeof _noop;// eslint-disable-line no-var
	var pass: typeof _pass;// eslint-disable-line no-var
}


const _global = typeof global == "undefined" ? window : global;

/** @deprecated */
_global.noop = _noop;

/** @deprecated */
_global.pass = _pass;
