import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeQuestion } from '../factories/make-question';
import { makeQuestionAttachment } from '../factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository';

describe('Delete Question Use Case', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: DeleteQuestionUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(
			questionAttachmentsRepository,
		);
		sut = new DeleteQuestionUseCase(questionsRepository);
	});

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion();

		const firstAttachment = makeQuestionAttachment({
			questionId: newQuestion.id,
		});
		const secondAttachment = makeQuestionAttachment({
			questionId: newQuestion.id,
		});

		questionAttachmentsRepository.items.push(firstAttachment);
		questionAttachmentsRepository.items.push(secondAttachment);

		await questionsRepository.create(newQuestion);

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: newQuestion.authorId.toValue(),
		});

		expect(questionsRepository.items).toHaveLength(0);
		expect(questionAttachmentsRepository.items).toHaveLength(0);
	});

	it('should be not able to delete a question from another', async () => {
		const newQuestion = makeQuestion();

		await questionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'some-author-id',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(questionsRepository.items).toHaveLength(1);
	});
});
