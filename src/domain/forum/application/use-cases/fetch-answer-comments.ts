import { Either, Right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		answerComments: AnswerComment[];
	}
>;

export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute(
		params: FetchAnswerCommentsUseCaseRequest,
	): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments =
			await this.answerCommentsRepository.findManyByAnswerId(params.answerId, {
				page: params.page,
			});

		return Right.create({ answerComments });
	}
}
