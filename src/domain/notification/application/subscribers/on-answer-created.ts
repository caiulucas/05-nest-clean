import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/entities/events/answer-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	private async sendNewAnswerNotification(event: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			event.answer.questionId.toValue(),
		);

		if (question) {
			await this.sendNotification.execute({
				recipientId: question.authorId.toValue(),
				title: `Nova resposta em "${question.title}"`,
				content: question.excerpt,
			});
		}
	}

	public setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}
}
