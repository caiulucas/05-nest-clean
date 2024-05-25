import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeAnswer } from '../factories/make-answer';
import { makeQuestion } from '../factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository';

describe('Choose Question Best Answer Use Case', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: ChooseQuestionBestAnswerUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(
			questionAttachmentsRepository,
		);
		answersRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new ChooseQuestionBestAnswerUseCase(
			questionsRepository,
			answersRepository,
		);
	});

	it('should be able to choose the question best answer', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await questionsRepository.create(question);
		await answersRepository.create(answer);

		expect(answersRepository.items).toHaveLength(1);

		await sut.execute({
			authorId: question.authorId.toValue(),
			answerId: answer.id.toValue(),
		});

		expect(questionsRepository.items[0].bestAnswerId).toBe(answer.id);
	});

	it('should be not able to choose another author`s question best answer', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await questionsRepository.create(question);
		await answersRepository.create(answer);

		const result = await sut.execute({
			authorId: 'some-author-id',
			answerId: answer.id.toValue(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
