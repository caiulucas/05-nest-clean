export abstract class WatchedList<T> {
	private current: T[];
	private initial: T[];
	private new: T[];
	private removed: T[];

	protected constructor(initialItems?: T[]) {
		this.current = initialItems ?? [];
		this.initial = initialItems ?? [];
		this.new = [];
		this.removed = [];
	}

	protected abstract compareItems(a: T, b: T): boolean;

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
		return !!this.current.find((itemToCompare) =>
			this.compareItems(item, itemToCompare),
		);
	}

	private isNewItem(item: T): boolean {
		return !!this.new.find((itemToCompare) =>
			this.compareItems(item, itemToCompare),
		);
	}

	private isRemovedItem(item: T): boolean {
		return !!this.removed.find((itemToCompare) =>
			this.compareItems(item, itemToCompare),
		);
	}

	private removeFromNew(item: T): void {
		this.new = this.new.filter(
			(itemToRemove) => !this.compareItems(item, itemToRemove),
		);
	}

	private removeFromCurrent(item: T): void {
		this.current = this.current.filter(
			(itemToRemove) => !this.compareItems(item, itemToRemove),
		);
	}

	private removeFromRemoved(item: T): void {
		this.removed = this.removed.filter(
			(itemToRemove) => !this.compareItems(item, itemToRemove),
		);
	}

	private wasAddedInitially(item: T): boolean {
		return !!this.initial.find((itemToCompare) =>
			this.compareItems(item, itemToCompare),
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
		const newItems = items.filter(
			(item) =>
				!this.currentItems.some((itemToCompare) =>
					this.compareItems(item, itemToCompare),
				),
		);

		const removedItems = this.currentItems.filter(
			(item) =>
				!items.some((itemToCompare) => this.compareItems(item, itemToCompare)),
		);

		this.current = items;
		this.new = newItems;
		this.removed = removedItems;
	}
}
