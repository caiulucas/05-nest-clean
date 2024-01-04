import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { makeAnswer } from '../factories/make-answer';
import { makeAnswerAttachment } from '../factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository';

describe('Delete Answer Use Case', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: DeleteAnswerUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new DeleteAnswerUseCase(answersRepository);
	});

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer();

		await answersRepository.create(newAnswer);

		const firstAttachment = makeAnswerAttachment({
			answerId: newAnswer.id,
		});
		const secondAttachment = makeAnswerAttachment({
			answerId: newAnswer.id,
		});

		answerAttachmentsRepository.items.push(firstAttachment);
		answerAttachmentsRepository.items.push(secondAttachment);

		await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: newAnswer.authorId.toValue(),
		});

		expect(answersRepository.items).toHaveLength(0);
		expect(answerAttachmentsRepository.items).toHaveLength(0);
	});

	it('should be not able to delete a answer from another author', async () => {
		const newAnswer = makeAnswer();

		await answersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'some-author-id',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(answersRepository.items).toHaveLength(1);
	});
});
