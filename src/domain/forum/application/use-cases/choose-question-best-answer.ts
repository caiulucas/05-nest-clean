import { Either, Left, Right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Question } from '../../enterprise/entities/question';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface ChooseQuestionBestAnswerRequest {
	authorId: string;
	answerId: string;
	questionId: string;
}

type ChooseQuestionBestAnswerResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswer {
	constructor(
		private questionsRepository: QuestionsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute(
		request: ChooseQuestionBestAnswerRequest,
	): Promise<ChooseQuestionBestAnswerResponse> {
		const question = await this.questionsRepository.findById(
			request.questionId,
		);

		if (!question) {
			return Left.create(new ResourceNotFoundError());
		}

		if (request.authorId !== question.authorId.toValue()) {
			return Left.create(new NotAllowedError());
		}

		const answer = await this.answersRepository.findById(request.answerId);

		if (!answer) {
			return Left.create(new ResourceNotFoundError());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return Right.create({ question });
	}
}
