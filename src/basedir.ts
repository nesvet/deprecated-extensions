import fs from "node:fs";
import path from "node:path";

/** @deprecated */
export let [ , basedir ] = process.argv;

while (basedir && basedir !== "/" && !fs.existsSync(path.join(basedir, "package.json")))
	basedir = path.dirname(basedir);
