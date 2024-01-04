import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { makeQuestion } from '../factories/make-question';
import { makeQuestionAttachment } from '../factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository';

describe('Edit Question Use Case', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: EditQuestionUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(
			questionAttachmentsRepository,
		);
		sut = new EditQuestionUseCase(
			questionsRepository,
			questionAttachmentsRepository,
		);
	});

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion();

		await questionsRepository.create(newQuestion);

		const editedQuestion = {
			authorId: newQuestion.authorId.toValue(),
			questionId: newQuestion.id.toValue(),
			title: 'Edited question',
			content: 'This is a new content',
		};

		const firstAttachment = makeQuestionAttachment({
			questionId: newQuestion.id,
		});
		const secondAttachment = makeQuestionAttachment({
			questionId: newQuestion.id,
		});

		questionAttachmentsRepository.items.push(firstAttachment);
		questionAttachmentsRepository.items.push(secondAttachment);

		const newAttachmentId = new UniqueEntityId();

		await sut.execute({
			...editedQuestion,
			attachmentsIds: [
				firstAttachment.attachmentId.toValue(),
				newAttachmentId.toValue(),
			],
		});

		expect(questionsRepository.items[0]).toMatchObject({
			title: editedQuestion.title,
			content: editedQuestion.content,
		});

		expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
			2,
		);
		expect(questionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({
				attachmentId: firstAttachment.attachmentId,
			}),
			expect.objectContaining({
				attachmentId: newAttachmentId,
			}),
		]);
	});

	it('should be not able to edit a question from another author', async () => {
		const newQuestion = makeQuestion();

		await questionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'some-author-id',
			title: 'Edited question',
			content: 'This is a new content',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
