import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryNotificationsRepository } from '../repositories/in-memory-notifications-repository';

describe('Send Notification Use Case', () => {
	let notificationsRepository: InMemoryNotificationsRepository;
	let sut: SendNotificationUseCase;

	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(notificationsRepository);
	});

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: '1',
			title: 'Notification test',
			content:
				'Hi, this is a testing content for this notification. How are you doing today?',
		});

		expect(result.isRight()).toBe(true);
		expect(notificationsRepository.items[0]).toEqual(
			result.value?.notification,
		);
	});
});
