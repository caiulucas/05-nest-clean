export abstract class WatchedList<T> {
	private current: T[];
	private initial: T[];
	private new: T[];
	private removed: T[];

	constructor(initialItems?: T[]) {
		this.current = initialItems || [];
		this.initial = initialItems || [];
		this.new = [];
		this.removed = [];
	}

	abstract compareItems(a: T, b: T): boolean;

	get currentItems(): T[] {
		return this.current;
	}

	get newItems(): T[] {
		return this.new;
	}

	get removedItems(): T[] {
		return this.removed;
	}

	private isCurrentItem(item: T): boolean {
		return (
			this.current.filter((v: T) => this.compareItems(item, v)).length !== 0
		);
	}

	private isNewItem(item: T): boolean {
		return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0;
	}

	private isRemovedItem(item: T): boolean {
		return (
			this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
		);
	}

	private removeFromNew(item: T): void {
		this.new = this.new.filter((v) => !this.compareItems(v, item));
	}

	private removeFromCurrent(item: T): void {
		this.current = this.current.filter((v) => !this.compareItems(item, v));
	}

	private removeFromRemoved(item: T): void {
		this.removed = this.removed.filter((v) => !this.compareItems(item, v));
	}

	private wasAddedInitially(item: T): boolean {
		return (
			this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
		);
	}

	public exists(item: T): boolean {
		return this.isCurrentItem(item);
	}

	public add(item: T): void {
		if (this.isRemovedItem(item)) {
			this.removeFromRemoved(item);
		}

		if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
			this.new.push(item);
		}

		if (!this.isCurrentItem(item)) {
			this.current.push(item);
		}
	}

	public remove(item: T): void {
		this.removeFromCurrent(item);

		if (this.isNewItem(item)) {
			this.removeFromNew(item);

			return;
		}

		if (!this.isRemovedItem(item)) {
			this.removed.push(item);
		}
	}

	public update(items: T[]): void {
		const newItems = items.filter((a) => {
			return !this.current.some((b) => this.compareItems(a, b));
		});

		const removedItems = this.current.filter((a) => {
			return !items.some((b) => this.compareItems(a, b));
		});

		this.current = items;
		this.new = newItems;
		this.removed = removedItems;
	}
}
