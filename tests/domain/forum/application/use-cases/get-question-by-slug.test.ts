import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeQuestion } from '../factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository';

describe('Get Question By Slug ', () => {
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let questionsRepository: QuestionsRepository;
	let sut: GetQuestionBySlugUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(
			questionAttachmentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(questionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.createFromText('Example question'),
		});

		questionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.isRight()).toBe(true);

		expect(result.value).toMatchObject({
			question: {
				title: newQuestion.title,
			},
		});
	});
});
