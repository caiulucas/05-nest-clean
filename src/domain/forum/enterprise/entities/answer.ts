import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerAttachmentList } from './answer-attachment-list';
import { AnswerCreatedEvent } from './events/answer-created-event';

export interface AnswerProps {
	content: string;
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	attachments: AnswerAttachmentList;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerProps> {
	static create(
		props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
		id?: UniqueEntityId,
	) {
		const answer = new Answer(
			{
				...props,
				attachments: props.attachments ?? AnswerAttachmentList.create(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		const isNewAnswer = !id;

		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}

		return answer;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get attachments() {
		return this.props.attachments;
	}

	set attachments(attachment: AnswerAttachmentList) {
		this.props.attachments = attachment;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}
}
