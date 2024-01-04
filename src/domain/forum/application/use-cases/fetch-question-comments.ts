import { Either, Right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questionComments: QuestionComment[];
	}
>;
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute(
		params: FetchQuestionCommentsUseCaseRequest,
	): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments =
			await this.questionCommentsRepository.findManyByQuestionId(
				params.questionId,
				{ page: params.page },
			);

		return Right.create({ questionComments });
	}
}
