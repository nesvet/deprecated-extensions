import "./Math";
import "./Date";
import "./Object";
import "./Array";
import "./Set";
import "./Map";
//#if _SERVER
import { basedir } from "./basedir";
//#endif
import { noop } from "./noop";
import { pass } from "./pass";


const _global = typeof global == "undefined" ? window : global;

//#if _SERVER
_global.__basedir = basedir;
//#endif
_global.noop = noop;
_global.pass = pass;
