Object.defineProperty(Set.prototype, "first", {
	get() {
		return this.values().next().value;
	}
});

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
		if (item = callback(item))
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

Set.Empty = class EmptySet extends Set {
	constructor() {
		super();
		
	}
	
	add() {
		return this;
	}
	
};
