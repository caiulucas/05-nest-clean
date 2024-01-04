import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notification[];

	constructor() {
		this.items = [];
	}

	async create(notification: Notification) {
		this.items.push(notification);
	}

	async save(notification: Notification) {
		const index = this.items.findIndex((item) => item.id === notification.id);

		this.items[index] = notification;
	}

	async findById(notificationId: string) {
		return (
			this.items.find((item) => item.id.toValue() === notificationId) ?? null
		);
	}
}
