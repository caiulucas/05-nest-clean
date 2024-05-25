import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository';

describe('Answer Question Use Case', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: AnswerQuestionUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new AnswerQuestionUseCase(answersRepository);
	});

	it('should be able to create an question', async () => {
		const result = await sut.execute({
			authorId: '1',
			questionId: '1',
			content:
				'Hi, this is a testing content for this question. How are you doing today?',
			attachmentIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(answersRepository.items[0]).toEqual(result.value?.answer);
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityId('1'),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityId('2'),
			}),
		]);
	});
});
