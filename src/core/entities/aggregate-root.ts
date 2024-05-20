import type { DomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';
import { Entity } from './entity';
import type { UniqueEntityId } from './unique-entity-id';

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: DomainEvent[];

	constructor(props: T, id?: UniqueEntityId) {
		super(props, id);
		this._domainEvents = [];
	}

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent): void {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}
}
