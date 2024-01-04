import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { makeQuestionComment } from '../factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from '../repositories/in-memory-question-comments-repository';

describe('Fetch Question Comments', () => {
	let questionCommentsRepository: QuestionCommentsRepository;
	let sut: FetchQuestionCommentsUseCase;

	beforeEach(() => {
		questionCommentsRepository = new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentsUseCase(questionCommentsRepository);

		vi.useFakeTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('should be able to fetch question comments', async () => {
		for (let i = 0; i < 3; i++) {
			await questionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
			);
		}

		const result = await sut.execute({
			questionId: 'question-1',
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(3);
	});

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 0; i < 22; i++) {
			await questionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
			);
		}

		const result = await sut.execute({
			questionId: 'question-1',
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(2);
	});
});
