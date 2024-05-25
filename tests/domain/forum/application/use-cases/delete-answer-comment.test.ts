import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeAnswerComment } from '../factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answer-comments-repository';

describe('Delete Answer Comment Use Case', () => {
	let answerCommentsRepository: InMemoryAnswerCommentsRepository;
	let sut: DeleteAnswerCommentUseCase;

	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
	});

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment();

		await answerCommentsRepository.create(answerComment);

		expect(answerCommentsRepository.items).toHaveLength(1);

		await sut.execute({
			authorId: answerComment.authorId.toValue(),
			answerCommentId: answerComment.id.toValue(),
		});

		expect(answerCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another author answer comment', async () => {
		const answerComment = makeAnswerComment();

		await answerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			authorId: 'some-author-id',
			answerCommentId: answerComment.id.toValue(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);

		expect(answerCommentsRepository.items).toHaveLength(1);
	});
});
