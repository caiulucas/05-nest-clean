import { Either, Right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;

export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute(
		params: FetchQuestionAnswersUseCaseRequest,
	): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			params.questionId,
			{ page: params.page },
		);

		return Right.create({ answers });
	}
}
