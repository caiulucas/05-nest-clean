import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository';

describe('Create Question Use Case', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: CreateQuestionUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(
			questionAttachmentsRepository,
		);
		sut = new CreateQuestionUseCase(questionsRepository);
	});

	it('should be able to create an answer', async () => {
		const result = await sut.execute({
			title: 'Answer test',
			authorId: '1',
			content:
				'Hi, this is a testing content for this question. How are you doing today?',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(questionsRepository.items[0]).toEqual(result.value?.question);
		expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
			2,
		);
		expect(questionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityId('1'),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityId('2'),
			}),
		]);
	});

	it('should persist attachments when creating a new question', async () => {
		const result = await sut.execute({
			title: 'Answer test',
			authorId: '1',
			content:
				'Hi, this is a testing content for this question. How are you doing today?',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(questionAttachmentsRepository.items).toHaveLength(2);
		expect(questionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('2'),
				}),
			]),
		);
	});
});
