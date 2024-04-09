Object.deepClone = function (object) {
	return JSON.parse(JSON.stringify(object));
};

Object.getPath = function (object, path) {
	return path ?
		~path.indexOf(".") ?
			path.split(".").reduce((object, key) => object?.[key], object) :
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
				host = subHost;
			}
			
			return host[pathArray[penultIndex + 1]] = value;
		} else
			return object[path] = value;
	}
};

Object.assignPath = function (target, ...sources) {
	for (const source of sources)
		for (const path in source)
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
				host = host[subPath];
				if (!host || !(typeof host == "object" || typeof host == "function"))
					return false;
			}
			
			return delete host[pathArray[penultIndex + 1]];
		} else
			return delete object[path];
	}
};

Object.isEmpty = function (object) {
	for (const key in object)
		return false;
	return true;
};

Object.isPlain = function (object, strict = true) {
	return (
		object &&
		typeof object == "object" &&
		(!strict || object.constructor == Object) &&
		Object.prototype.toString.call(object) == "[object Object]"
	);
};

Object.flat = function (object, strict = true, prefix) {
	const entries = Object.entries(object);
	
	for (let i = 0; i < entries.length; i++) {
		const [ key, value ] = entries[i];
		if (Object.isPlain(value, strict) && !Object.isEmpty(value)) {
			entries.splice(i, 1);
			let j = i--;
			for (const subkey in value)
				entries.splice(j++, 0, [ key+"."+subkey, value[subkey] ]);
		}
	}
	
	if (prefix) {
		prefix = prefix+".";
		return Object.fromEntries(entries.map(([ key, value ]) => [ prefix+key, value ]));
	} else
		return Object.fromEntries(entries);
};

Object.unflat = function (flattenedObject) {
	
	const object = {};
	
	for (const key in flattenedObject) {
		let subobject = object;
		const subkeys = key.split(".");
		const valueKey = subkeys.pop();
		for (const subkey of subkeys)
			subobject = subobject[subkey] ?? (subobject[subkey] = {});
		subobject[valueKey] = flattenedObject[key];
	}
	
	return object;
};

Object.deepMerge = function deepMerge(...args) {
	const strict = typeof args.at(-1) == "boolean" ? args.pop() : true;
	return Object.unflat(Object.assign(...args.map(object => Object.flat(object, strict))));
};

Object.pick = function (object, ...keys) {
	
	const pick = {};
	
	for (const key of keys)
		pick[key] = object[key];
	
	return pick;
};

Object.keep = function (object, ...keys) {
	for (const key in object)
		if (!keys.includes(key))
			delete this[key];
	
	return this;
};

Object.extract = function (object, ...keys) {
	
	const extraction = {};
	
	for (const key of keys) {
		extraction[key] = object[key];
		delete object[key];
	}
	
	return extraction;
};

Object.delete = function(object, ...keys) {
	if (object) {
		for (const key of keys)
			delete object[key];
		
		return object;
	}
};

Object.clear = function (object) {
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
