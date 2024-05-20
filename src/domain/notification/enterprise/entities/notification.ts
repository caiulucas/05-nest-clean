import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

export type NotificationProps = {
	recipientId: UniqueEntityId;
	title: string;
	content: string;
	createdAt: Date;
	readAt?: Date;
};

export class Notification extends Entity<NotificationProps> {
	static create(
		props: Optional<NotificationProps, 'createdAt'>,
		id?: UniqueEntityId,
	) {
		return new Notification(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}

	get recipientId() {
		return this.props.recipientId;
	}

	get title() {
		return this.props.title;
	}

	get content() {
		return this.props.content;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get readAt() {
		return this.props.readAt;
	}

	public read() {
		this.props.readAt = new Date();
	}
}
