import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { makeAnswerComment } from '../factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answer-comments-repository';

describe('Fetch Answer Comments', () => {
	let answerCommentsRepository: AnswerCommentsRepository;
	let sut: FetchAnswerCommentsUseCase;

	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswerCommentsUseCase(answerCommentsRepository);

		vi.useFakeTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('should be able to fetch answer comments', async () => {
		for (let i = 0; i < 3; i++) {
			await answerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
			);
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(3);
	});

	it('should be able to fetch paginated answer comments', async () => {
		for (let i = 0; i < 22; i++) {
			await answerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
			);
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(2);
	});
});
