/* eslint-disable no-extend-native */

class EmptyArray extends Array {
	constructor() {
		super();
		
		Object.freeze(this);
		
	}
	
	push() {
		return 0;
	}
	
	unshift() {
		return 0;
	}
	
	splice() {
		return [];
	}
	
}

declare global {
	
	interface Array<T> {
		
		/** @deprecated */
		add(item: T, toBeginning: boolean): this;
		
		/** @deprecated */
		addAll(items: T[]): this;
		
		/** @deprecated */
		empty(): void;
		
		/** @deprecated */
		filterMap(callback: (item: T) => unknown): unknown[];
		
		/** @deprecated */
		first: T;
		
		/** @deprecated */
		ids(): string[];
		
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
		invokeMap(...args: unknown[]): void;
		
		/** @deprecated */
		last: T;
		
		/** @deprecated */
		pushAll(items: T[]): number;
		
		/** @deprecated */
		random(): T;
		
		/** @deprecated */
		remove(item: T): number;
		
		/** @deprecated */
		removeAll(items: T[]): number;
		
		/** @deprecated */
		removeOne(item: T): boolean;
		
		/** @deprecated */
		trimTo(ids: string[]): T[];
		
		/** @deprecated */
		with(...arrays: T[][]): T[];
		
		/** @deprecated */
		without(arrays: T[][]): T[];
		
	}
	
	interface ArrayConstructor {
		
		/** @deprecated */
		Empty: typeof EmptyArray;
	}
	
}


try {
	Object.defineProperty(Array.prototype, "first", {
		get() {
			return this[0];
		}
	});
	
	Object.defineProperty(Array.prototype, "last", {
		get() {
			return this.at(-1);
		}
	});
} catch {}

Array.prototype.add = function (item, toBeginning) {
	if (!this.includes(item))
		if (toBeginning)
			this.unshift(item);
		else
			this.push(item);
	
	return this;
};

Array.prototype.addAll = function (items) {
	for (const item of items)
		if (!this.includes(item))
			this.push(item);
	
	return this;
};

Array.prototype.pushAll = function (items) {
	for (const item of items)
		this.push(item);
	
	return this.length;
};

Array.prototype.random = function () {
	return this[this.length * Math.random() | 0];// eslint-disable-line no-bitwise
};

Array.prototype.with = function (...arrays) {
	return [ ...new Set(this.concat(...arrays)) ];
};

Array.prototype.removeOne = function (item) {
	const i = this.indexOf(item);
	if (i > -1) {
		this.splice(i, 1);
		
		return true;
	}
	
	return false;
};

Array.prototype.remove = function (item) {
	
	let i,
		removed = 0;
	while ((i = this.indexOf(item)) > -1) {
		this.splice(i, 1);
		removed++;
	}
	
	return removed;
};

Array.prototype.removeAll = function (items) {
	
	let removed = 0;
	for (const item of items)
		removed += this.remove(item);
	
	return removed;
};

Array.prototype.without = function (...arrays) {
	const flattenedArray = arrays.flat();
	
	return this.filter(item => !flattenedArray.includes(item));
};

Array.prototype.empty = function () {
	
	this.length = 0;
	
};

Array.prototype.filterMap = function (callback) {
	
	const a = [];
	for (let item of this)
		if ((item = callback(item)))
			a.push(item);
	
	return a;
};

Array.prototype.intersection = function (iterable) {
	return this.filter(item => iterable.includes(item));
};

Array.prototype.includesAny = function (array) {
	return array.some(item => this.includes(item));
};

Array.prototype.includesAll = function (array) {
	return array.every(item => this.includes(item));
};

Array.prototype.ids = function () {
	
	const a = [];
	for (const item of this)
		a.push(item._id);
	
	return a;
};

Array.prototype.trimTo = function (ids) {
	return this.filter(item => ids.includes(item._id));
};

Array.prototype.invoke = function (...args) {
	
	for (const fn of this)
		fn.apply(this, args);
	
};

Array.prototype.invokeCall = function (thisArg, ...args) {
	
	for (const fn of this)
		fn.apply(thisArg, args);
	
};

Array.prototype.invokeMap = function (...args) {
	
	const a = [];
	for (const fn of this)
		a.push(fn.apply(this, args));
	
	return a;
};

Array.Empty = EmptyArray;
