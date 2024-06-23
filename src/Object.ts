type Target = Record<string, unknown>;
type SubTarget = Target | unknown;

declare global {
	interface ObjectConstructor {
		
		/** @deprecated */
		assignPath(target: Target, ...sources: Target[]): Target;
		
		/** @deprecated */
		cleanup(object: Target): Target;
		
		/** @deprecated */
		clear(object: Target): Target;
		
		/** @deprecated */
		deepClone(object: Target): object;
		
		/** @deprecated */
		deepMerge(...args: Target[]): object;
		
		/** @deprecated */
		delete(object: Target, ...keys: string[]): null | Target;
		
		/** @deprecated */
		deletePath(object: Target, path: string): boolean | null;
		
		/** @deprecated */
		extract(object: Target, ...keys: string[]): object;
		
		/** @deprecated */
		flat(object: Target, strict?: boolean, prefix?: string): Target;
		
		/** @deprecated */
		getPath(object: Target, path: string): unknown;
		
		/** @deprecated */
		isEmpty(object: Target): boolean;
		
		/** @deprecated */
		isPlain(object: Target, strict?: boolean): boolean;
		
		/** @deprecated */
		keep(object: Target, ...keys: string[]): Target;
		
		/** @deprecated */
		pick(object: Target, ...keys: string[]): object;
		
		/** @deprecated */
		setPath(object: Target, path: string, value: unknown): unknown;
		
		/** @deprecated */
		unflat(flattenedObject: Target): object;
		
	}
}

Object.deepClone = function (object) {
	return JSON.parse(JSON.stringify(object));// eslint-disable-line unicorn/prefer-structured-clone
};

Object.getPath = function (object, path) {
	return path ?
		~path.indexOf(".") ?
			path.split(".").reduce((subObject: SubTarget, key: string) => (subObject as Target)?.[key], object) :
			object[path] :
		object;
};

Object.setPath = function (object, path, value) {
	if (path) {
		const pathArray = path.split(".");
		const penultIndex = pathArray.length - 2;
		if (penultIndex >= 0) {
			let host = object;
			
			for (let i = 0, subPath, subHost; i <= penultIndex; i++) {
				subPath = pathArray[i];
				subHost = host[subPath];
				if (!subHost || !(typeof subHost == "object" || typeof subHost == "function"))
					subHost = host[subPath] = {};
				host = subHost as Target;
			}
			
			return (host[pathArray[penultIndex + 1]] = value);
		}
		
		return (object[path] = value);
	}
	
	return null;
};

Object.assignPath = function (target, ...sources) {
	for (const source of sources)
		for (const path in source)// eslint-disable-line guard-for-in
			Object.setPath(target, path, source[path]);
	
	return target;
};

Object.deletePath = function (object, path) {
	if (path) {
		const pathArray = path.split(".");
		const penultIndex = pathArray.length - 2;
		if (penultIndex >= 0) {
			let host = object;
			
			for (let i = 0, subPath; i <= penultIndex; i++) {
				subPath = pathArray[i];
				host = host[subPath] as Target;
				if (!host || !(typeof host == "object" || typeof host == "function"))
					return false;
			}
			
			return delete host[pathArray[penultIndex + 1]];
		}
		
		return delete object[path];
	}
	
	return null;
};

Object.isEmpty = function (object) {
	// eslint-disable-next-line guard-for-in, no-unreachable-loop
	for (const key in object)
		return false;
	
	return true;
};

Object.isPlain = function (object, strict = true) {
	return (
		object &&
		typeof object == "object" &&
		(!strict || object.constructor === Object) &&
		Object.prototype.toString.call(object) === "[object Object]"
	);
};

Object.flat = function (object, strict = true, prefix) {
	const entries = Object.entries(object);
	
	for (let i = 0; i < entries.length; i++) {
		const [ key, value ] = entries[i];
		if (value && typeof value == "object" && Object.isPlain(value as Target, strict) && !Object.isEmpty(value as Target)) {
			entries.splice(i, 1);
			let j = i--;
			// eslint-disable-next-line guard-for-in
			for (const subkey in value)
				entries.splice(j++, 0, [ `${key}.${subkey}`, (value as Target)[subkey] ]);
		}
	}
	
	if (prefix) {
		prefix += ".";
		
		return Object.fromEntries(entries.map(([ key, value ]) => [ prefix + key, value ]));
	}
	
	return Object.fromEntries(entries);
};

Object.unflat = function (flattenedObject) {
	
	const object = {};
	
	// eslint-disable-next-line guard-for-in
	for (const key in flattenedObject) {
		let subobject = object as Target;
		const subkeys = key.split(".");
		const valueKey = subkeys.pop()!;
		for (const subkey of subkeys)
			subobject = (subobject[subkey] ??= {}) as Target;
		subobject[valueKey] = flattenedObject[key];
	}
	
	return object;
};

Object.deepMerge = function deepMerge(target, ...args) {
	const strict = Boolean(typeof args.at(-1) == "boolean" ? args.pop() : true);
	
	return Object.unflat(Object.assign(Object.flat(target, strict), ...args.map(object => Object.flat(object, strict))));
};

Object.pick = function (object, ...keys) {
	
	const pick = {} as Record<string, unknown>;
	
	for (const key of keys)
		pick[key] = object[key];
	
	return pick;
};

Object.keep = function (object, ...keys) {
	for (const key in object)
		if (!keys.includes(key))
			delete object[key];
	
	return object;
};

Object.extract = function (object, ...keys) {
	
	const extraction = {} as Record<string, unknown>;
	
	for (const key of keys) {
		extraction[key] = object[key];
		delete object[key];
	}
	
	return extraction;
};

Object.delete = function (object, ...keys) {
	if (object) {
		for (const key of keys)
			delete object[key];
		
		return object;
	}
	
	return null;
};

Object.clear = function (object) {
	// eslint-disable-next-line guard-for-in
	for (const key in object)
		delete object[key];
	
	return object;
};

Object.cleanup = function (object) {
	for (const key of Object.keys(object))
		if (object[key] === undefined)
			delete object[key];
	
	return object;
};
