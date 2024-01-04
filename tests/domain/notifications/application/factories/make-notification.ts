import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Notification,
	NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { faker } from '@faker-js/faker';

export function makeNotification(
	override?: Partial<NotificationProps>,
	id?: UniqueEntityId,
) {
	const title = faker.lorem.sentence();

	const notification = Notification.create(
		{
			recipientId: override?.recipientId ?? new UniqueEntityId(),
			title,
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return notification;
}
