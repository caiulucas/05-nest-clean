import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created';
import {
	SendNotificationUseCase,
	SendNotificationUseCaseRequest,
	SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification';
import { makeAnswer } from 'tests/domain/forum/application/factories/make-answer';
import { makeQuestion } from 'tests/domain/forum/application/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'tests/domain/forum/application/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/domain/forum/application/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'tests/domain/forum/application/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/domain/forum/application/repositories/in-memory-questions-repository';
import { waitFor } from 'tests/utils/wait-for';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockInstance } from 'vitest';
import { InMemoryNotificationsRepository } from '../repositories/in-memory-notifications-repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
	});

	it('should  send a notification when an answer is created', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		inMemoryQuestionsRepository.create(question);
		inMemoryAnswersRepository.create(answer);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled();
		});
	});
});
