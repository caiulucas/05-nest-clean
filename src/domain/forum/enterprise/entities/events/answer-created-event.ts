import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Answer } from '../answer';

export class AnswerCreatedEvent implements DomainEvent {
	public ocurredAt: Date;
	private _answer: Answer;

	constructor(answer: Answer) {
		this.ocurredAt = new Date();
		this._answer = answer;
	}

	get answer() {
		return this._answer;
	}

	getAggregateId(): UniqueEntityId {
		return this.answer.id;
	}
}
