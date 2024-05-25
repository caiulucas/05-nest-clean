import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeNotification } from '../factories/make-notification';
import { InMemoryNotificationsRepository } from '../repositories/in-memory-notifications-repository';

describe('Read Notification Use Case', () => {
	let notificationsRepository: InMemoryNotificationsRepository;
	let sut: ReadNotificationUseCase;

	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository();
		sut = new ReadNotificationUseCase(notificationsRepository);
	});

	it('should be able to read a notification', async () => {
		const notification = makeNotification();

		notificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: notification.recipientId.toValue(),
			notificationId: notification.id.toValue(),
		});

		expect(result.isRight()).toBe(true);
		expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date));
	});

	it('should be able to read a notification from another recipient', async () => {
		const notification = makeNotification();

		notificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: 'some-recipient-id',
			notificationId: notification.id.toValue(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
