import { WatchedList } from '@/core/entities/watched-list';
import { describe, it, expect } from 'vitest';

class NumberWatchedList extends WatchedList<number> {
	static create(initialItems?: number[]) {
		return new NumberWatchedList(initialItems);
	}

	protected compareItems(a: number, b: number): boolean {
		return a === b;
	}
}

describe('Watched List', () => {
	it('should be able to create a watched list with initial items', () => {
		const list = NumberWatchedList.create([1, 2, 3]);

		expect(list.currentItems).toHaveLength(3);
	});

	it('should be able to add new items to the list', () => {
		const list = NumberWatchedList.create([1, 2, 3]);

		list.add(4);

		expect(list.currentItems).toHaveLength(4);
		expect(list.newItems).toEqual([4]);
	});

	it('should be able to remove items from the list', () => {
		const list = NumberWatchedList.create([1, 2, 3]);

		list.remove(2);

		expect(list.currentItems).toHaveLength(2);
		expect(list.removedItems).toEqual([2]);
	});

	it('should be able to add an item even if it was removed before', () => {
		const list = NumberWatchedList.create([1, 2, 3]);

		list.remove(2);
		list.add(2);

		expect(list.currentItems).toHaveLength(3);
		expect(list.removedItems).toHaveLength(0);
		expect(list.newItems).toHaveLength(0);
	});

	it('should be able to update watched list items', () => {
		const list = NumberWatchedList.create([1, 2, 3]);

		list.update([1, 3, 5]);

		expect(list.currentItems).toHaveLength(3);
		expect(list.removedItems).toEqual([2]);
		expect(list.newItems).toEqual([5]);
	});
});
