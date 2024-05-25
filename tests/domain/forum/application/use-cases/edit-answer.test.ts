import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeAnswer } from '../factories/make-answer';
import { makeAnswerAttachment } from '../factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository';

describe('Edit Answer Use Case', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: EditAnswerUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
	});

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer();

		await answersRepository.create(newAnswer);

		const editedAnswer = {
			authorId: newAnswer.authorId.toValue(),
			answerId: newAnswer.id.toValue(),
			content: 'This is a new content',
		};

		const firstAttachment = makeAnswerAttachment({
			answerId: newAnswer.id,
		});
		const secondAttachment = makeAnswerAttachment({
			answerId: newAnswer.id,
		});

		answerAttachmentsRepository.items.push(firstAttachment);
		answerAttachmentsRepository.items.push(secondAttachment);

		const newAttachmentId = new UniqueEntityId();

		await sut.execute({
			...editedAnswer,
			attachmentsIds: [
				firstAttachment.attachmentId.toValue(),
				newAttachmentId.toValue(),
			],
		});

		expect(answersRepository.items[0]).toMatchObject({
			content: editedAnswer.content,
		});

		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({
				attachmentId: firstAttachment.attachmentId,
			}),
			expect.objectContaining({
				attachmentId: newAttachmentId,
			}),
		]);
	});

	it('should be not able to edit a answer from another author', async () => {
		const newAnswer = makeAnswer();

		await answersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'some-author-id',
			content: 'This is a new content',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
