import fs from "node:fs";
import path from "node:path";


export let basedir = process.argv[1];

while (basedir !== "/" && !fs.existsSync(path.join(basedir, "package.json")))
	basedir = path.dirname(basedir);
