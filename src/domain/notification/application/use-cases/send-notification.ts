import { Either, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification;
	}
>;

export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute(
		request: SendNotificationUseCaseRequest,
	): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			...request,
			recipientId: new UniqueEntityId(request.recipientId),
		});

		await this.notificationsRepository.create(notification);

		return Right.create({ notification });
	}
}
