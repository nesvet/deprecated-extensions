import path from "node:path";
import { Conveyer, ESBuild } from "cnvr";


const distDir = "dist";

const common = {
	external: true,
	format: "esm",
	sourcemap: true
};


new Conveyer([
	
	new ESBuild({
		title: "Server",
		entryPoints: [ "src/index.ts" ],
		outfile: path.resolve(distDir, "server.js"),
		platform: "node",
		target: "node20",
		jsccValues: {
			_SERVER: true
		},
		...common
	}),
	
	new ESBuild({
		title: "Client",
		entryPoints: [ "src/index.ts" ],
		outfile: path.resolve(distDir, "client.js"),
		platform: "neutral",
		target: "es2020",
		jsccValues: {
			_CLIENT: true
		},
		...common
	})
	
], {
	initialCleanup: distDir
});
