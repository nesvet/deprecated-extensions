/* eslint-disable no-extend-native */

class EmptySet extends Set {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
		
	}
	
	add() {
		return this;
	}
	
}

declare global {
	
	interface Set<T> {
		
		/** @deprecated */
		addAll(items: T[]): this;
		
		/** @deprecated */
		deleteAll(items: T[]): void;
		
		/** @deprecated */
		every(callback: (item: T) => boolean): boolean;
		
		/** @deprecated */
		filter(callback: (item: T) => boolean): T[];
		
		/** @deprecated */
		filterMap(callback: (item: T) => unknown): unknown[];
		
		/** @deprecated */
		first: T;
		
		/** @deprecated */
		hasAll(iterable: T[]): boolean;
		
		/** @deprecated */
		hasAny(iterable: T[]): boolean;
		
		/** @deprecated */
		ids(): string[];
		
		/** @deprecated */
		includes(item: T): boolean;
		
		/** @deprecated */
		includesAll(iterable: T[]): boolean;
		
		/** @deprecated */
		includesAny(iterable: T[]): boolean;
		
		/** @deprecated */
		intersection(iterable: T[]): T[];
		
		/** @deprecated */
		invoke(...args: unknown[]): void;
		
		/** @deprecated */
		invokeCall(...args: unknown[]): void;
		
		/** @deprecated */
		map(callback: (item: T, i: number) => unknown): unknown[];
		
		/** @deprecated */
		reAdd(item: T): this;
		
		/** @deprecated */
		reduce(callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, array: unknown[]) => unknown): unknown;
		
		/** @deprecated */
		remove(item: T): boolean;
		
		/** @deprecated */
		removeAll(items: T[]): void;
		
		/** @deprecated */
		reset(items: T[]): void;
		
		/** @deprecated */
		some(callback: (item: T) => boolean): boolean;
		
		/** @deprecated */
		sort(callback: (a: T, b: T) => number): this;
		
		/** @deprecated */
		trimTo(ids: string[]): T[];
		
		/** @deprecated */
		without(arrays: T[][]): T[];
		
	}
	
	interface SetConstructor {
		
		/** @deprecated */
		Empty: typeof EmptySet;
	}
	
}


try {
	Object.defineProperty(Set.prototype, "first", {
		get() {
			return this.values().next().value;
		}
	});
} catch {}

Set.prototype.addAll = function (items) {
	for (const item of items)
		this.add(item);
	
	return this;
};

Set.prototype.reAdd = function (item) {
	this.delete(item);
	this.add(item);
	
	return this;
};

Set.prototype.reset = function (items) {
	
	this.clear();
	
	if (items)
		for (const item of items)
			this.add(item);
	
};

Set.prototype.deleteAll = function (items) {
	for (const item of items)
		this.delete(item);
	
};

Set.prototype.remove = Set.prototype.delete;

Set.prototype.removeAll = Set.prototype.deleteAll;

Set.prototype.sort = function (callback) {
	for (const item of [ ...this ].sort(callback)) {
		this.delete(item);
		this.add(item);
	}
	
	return this;
};

Set.prototype.filter = function (callback) {
	
	const a = [];
	for (const item of this)
		if (callback(item))
			a.push(item);
	
	return a;
};

Set.prototype.filterMap = function (callback) {
	
	const a = [];
	for (let item of this)
		if ((item = callback(item)))
			a.push(item);
	
	return a;
};

Set.prototype.map = function (callback) {
	
	const a = [];
	let i = 0;
	for (const item of this)
		a.push(callback(item, i++));
	
	return a;
};

Set.prototype.reduce = function (...args) {
	return [ ...this ].reduce(...args);
};

Set.prototype.intersection = function (iterable) {
	
	const a = [];
	for (const item of this)
		if (iterable.includes(item))
			a.push(item);
	
	return a;
};

Set.prototype.without = function (...arrays) {
	const flattenedArray = arrays.flat();
	const a = [];
	for (const item of this)
		if (!flattenedArray.includes(item))
			a.push(item);
	
	return a;
};

Set.prototype.hasAny = function (iterable) {
	for (const item of iterable)
		if (this.has(item))
			return true;
	
	return false;
};

Set.prototype.hasAll = function (iterable) {
	for (const item of iterable)
		if (!this.has(item))
			return false;
	
	return true;
};

Set.prototype.includes = Set.prototype.has;
Set.prototype.includesAny = Set.prototype.hasAny;
Set.prototype.includesAll = Set.prototype.hasAll;

Set.prototype.some = function (callback) {
	for (const item of this)
		if (callback(item))
			return true;
	
	return false;
};

Set.prototype.every = function (callback) {
	for (const item of this)
		if (!callback(item))
			return false;
	
	return true;
};

Set.prototype.invoke = function (...args) {
	for (const fn of this)
		fn.apply(this, args);
	
};

Set.prototype.invokeCall = function (thisArg, ...args) {
	
	for (const fn of this)
		fn.apply(thisArg, args);
	
};

Set.prototype.ids = function () {
	
	const a = [];
	for (const item of this)
		a.push(item._id);
	
	return a;
};

Set.prototype.trimTo = function (ids) {
	
	const a = [];
	for (const item of this)
		if (ids.includes(item._id))
			a.push(item);
	
	return a;
};

Set.Empty = EmptySet;
