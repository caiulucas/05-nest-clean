import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { QuestionBestAnswerChosenEvent } from './events/question-best-answer-chosen-event';
import { QuestionAttachmentList } from './question-attachment-list';
import { Slug } from './value-objects/slug';

export interface QuestionProps {
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId;
	attachments: QuestionAttachmentList;
	title: string;
	content: string;
	slug?: Slug;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
	static create(
		props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
		id?: UniqueEntityId,
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? QuestionAttachmentList.create(),
				createdAt: new Date(),
			},
			id,
		);

		return question;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
		if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
			this.addDomainEvent(
				new QuestionBestAnswerChosenEvent(this, bestAnswerId),
			);
		}
		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	get attachments() {
		return this.props.attachments;
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get slug() {
		return this.props.slug;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isNew(): boolean {
		return dayjs().diff(this.createdAt, 'days') <= 3;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}
}
