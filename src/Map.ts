/* eslint-disable no-extend-native */

//#if _SERVER
import crypto from "node:crypto";
//#endif
import "./Math";


const { now } = Date;
const { random, randomInt, round, ceil, floor } = Math;
const { MAX_SAFE_INTEGER } = Number;


declare global {
	
	interface Map<K, V> {
		
		/** @deprecated */
		add(item: V): void;
		
		/** @deprecated */
		addAll(items: V[]): void;
		
		/** @deprecated */
		cid?: string;
		
		/** @deprecated */
		deleteAll(keys: K[]): void;
		
		/** @deprecated */
		deleteValue(value: V): void;
		
		/** @deprecated */
		everyValue(callback: (item: V) => boolean): boolean;
		
		/** @deprecated */
		filterMapValues(callback: (item: V) => unknown): unknown[];
		
		/** @deprecated */
		filterValues(callback: (item: V) => boolean): V[];
		
		/** @deprecated */
		findValue(callback: (item: V) => boolean): V;
		
		/** @deprecated */
		firstValue: V;
		
		/** @deprecated */
		getAll(keys: K[]): V[];
		
		/** @deprecated */
		getUntil(key: K, limit: number, delay: number): Promise<V>;
		
		/** @deprecated */
		getWithTimeout(key: K): V;
		
		/** @deprecated */
		hasAny(...items: V[]): boolean;
		
		/** @deprecated */
		ids(): string[];
		
		/** @deprecated */
		makeId(): string;
		
		/** @deprecated */
		map(callbackfn: (value: [K, V], index: number, array: [K, V][]) => unknown): unknown[];
		
		/** @deprecated */
		mapValues(callbackfn: (value: V, index: number, array: V[]) => unknown): unknown[];
		
		/** @deprecated */
		reduce(callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, array: [K, V][]) => unknown, initialValue: unknown): unknown;
		
		/** @deprecated */
		reduceValues(callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, array: V[]) => unknown, initialValue: unknown): unknown;
		
		/** @deprecated */
		remove(item: V): void;
		
		/** @deprecated */
		removeAll(items: V[]): void;
		
		/** @deprecated */
		reset(items: V[]): void;
		
		/** @deprecated */
		setWithTimeout(key: K, value: V, ms: number): this;
		
		/** @deprecated */
		setWithUid(value: V): this;
		
		/** @deprecated */
		someValue(callback: (item: V) => boolean): boolean;
		
		/** @deprecated */
		sort(callback: (a: [ K, V ], b: [ K, V ]) => number): this;
		
		/** @deprecated */
		uid(): string;
		
	}
	
}


try {
	Object.defineProperty(Map.prototype, "firstValue", {
		get() {
			return this.values().next().value;
		}
	});
} catch {}

Map.prototype.setWithTimeout = function (key, value, ms) {
	return this.set(key, [ value, setTimeout(() => this.delete(key), ms) ]);
};

Map.prototype.getWithTimeout = function (key) {
	const [ value, timeout ] = this.get(key) || [];
	clearTimeout(timeout);
	this.delete(key);
	
	return value;
};

Map.prototype.getUntil = function (key, limit = 1000, delay = 3) {
	return new Promise(resolve => {
		
		let item = this.get(key);
		if (item)
			resolve(item);
		else {
			const end = now() + limit;
			const interval = setInterval(() => {
				
				item = this.get(key);
				if (item || now() >= end) {
					clearInterval(interval);
					resolve(item);
				}
				
			}, delay);
		}
		
	});
};

Map.prototype.makeId = function () {
	
	const size = randomInt(8, 16);
	
	//#if _SERVER
	return crypto.randomBytes(size).toString("hex");
	//#else
	
	const string =
		round(random() * MAX_SAFE_INTEGER).toString(36) +
		now().toString(36) +
		round(random() * MAX_SAFE_INTEGER).toString(36);
	
	const halfExcess = (string.length - size) / 2;
	
	return string.slice(ceil(halfExcess), -floor(halfExcess));
	//#endif
};

Map.prototype.uid = function () {
	
	let _id;
	do
		_id = (this.cid ?? "") + this.makeId();
	while (this.has(_id));
	
	return _id;
};

Map.prototype.setWithUid = function (value) {
	return this.set(this.uid(), value);
};

Map.prototype.getAll = function (keys) {
	return keys.map(key => this.get(key));
};

Map.prototype.map = function (callback) {
	return [ ...this ].map(callback);
};

Map.prototype.mapValues = function (callback) {
	return [ ...this.values() ].map(callback);
};

Map.prototype.reduce = function (...args) {
	return [ ...this ].reduce(...args);
};

Map.prototype.reduceValues = function (...args) {
	return [ ...this.values() ].reduce(...args);
};

Map.prototype.filterValues = function (callback) {
	
	const a = [];
	for (const item of this.values())
		if (callback(item))
			a.push(item);
	
	return a;
};

Map.prototype.filterMapValues = function (callback) {
	
	const a = [];
	for (let item of this.values())
		if ((item = callback(item)))
			a.push(item);
	
	return a;
};

Map.prototype.sort = function (callback) {
	for (const [ key, value ] of [ ...this ].sort(callback)) {
		this.delete(key);
		this.set(key, value);
	}
	
	return this;
};

Map.prototype.ids = function () {
	return [ ...this.keys() ];
};

Map.prototype.add = function (item) {
	this.set(item._id, item);
	
};

Map.prototype.addAll = function (items) {
	for (const item of items)
		this.set(item._id, item);
	
	return this;
};

Map.prototype.deleteAll = function (keys) {
	for (const key of keys)
		this.delete(key);
	
};

Map.prototype.deleteValue = function (value) {
	for (const entry of this.entries())
		if (entry[1] === value)
			this.delete(entry[0]);
	
};

Map.prototype.remove = function (item) {
	this.delete(item._id);
	
};

Map.prototype.removeAll = function (items) {
	for (const item of items)
		this.delete(item._id);
	
};

Map.prototype.someValue = function (callback) {
	for (const item of this.values())
		if (callback(item))
			return true;
	
	return false;
};

Map.prototype.everyValue = function (callback) {
	for (const item of this.values())
		if (!callback(item))
			return false;
	
	return true;
};

Map.prototype.hasAny = function (...items) {
	for (const item of items)
		if (this.has(item._id))
			return true;
	
	return false;
};

Map.prototype.findValue = function (callback) {
	for (const item of this.values())
		if (callback(item))
			return item;
	
	return undefined;// eslint-disable-line unicorn/no-useless-undefined
};

Map.prototype.reset = function (items) {
	
	this.clear();
	if (items)
		for (const item of items)
			this.set(item._id, item);
	
};
