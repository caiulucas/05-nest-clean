import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityId } from '../entities/unique-entity-id';

import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: any) => void;

export class DomainEvents {
	private static handlersMap: Record<string, DomainEventCallback[]> = {};
	private static markedAggregates: AggregateRoot<any>[] = [];

	private static dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in DomainEvents.handlersMap;

		if (isEventRegistered) {
			const handlers = DomainEvents.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}

	private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
		for (const event of aggregate.domainEvents) {
			DomainEvents.dispatch(event);
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<any>,
	) {
		const index = DomainEvents.markedAggregates.findIndex((a) =>
			a.equals(aggregate),
		);

		DomainEvents.markedAggregates.splice(index, 1);
	}

	private static findMarkedAggregateByID(
		id: UniqueEntityId,
	): AggregateRoot<any> | undefined {
		return DomainEvents.markedAggregates.find((aggregate) =>
			aggregate.id.equals(id),
		);
	}

	public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
		const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			DomainEvents.markedAggregates.push(aggregate);
		}
	}

	public static dispatchEventsForAggregate(id: UniqueEntityId) {
		const aggregate = DomainEvents.findMarkedAggregateByID(id);

		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(
		callback: DomainEventCallback,
		eventClassName: string,
	) {
		const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;

		if (!wasEventRegisteredBefore) {
			DomainEvents.handlersMap[eventClassName] = [];
		}

		DomainEvents.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers() {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		DomainEvents.markedAggregates = [];
	}
}
