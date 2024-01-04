import { Either, Left, Right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/notifications-repository';

interface ReadNotificationUseCaseRequest {
	notificationId: string;
	recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		notification: Notification;
	}
>;

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute(
		request: ReadNotificationUseCaseRequest,
	): Promise<ReadNotificationUseCaseResponse> {
		const notification = await this.notificationsRepository.findById(
			request.notificationId,
		);

		if (!notification) {
			return Left.create(new ResourceNotFoundError());
		}

		if (notification.recipientId.toValue() !== request.recipientId) {
			return Left.create(new NotAllowedError());
		}

		notification.read();
		this.notificationsRepository.save(notification);

		return Right.create({ notification });
	}
}
