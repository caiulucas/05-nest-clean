import { Either, Left, Right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/question';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface ChooseQuestionBestAnswerRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute(
		request: ChooseQuestionBestAnswerRequest,
	): Promise<ChooseQuestionBestAnswerResponse> {
		const answer = await this.answersRepository.findById(request.answerId);

		if (!answer) {
			return Left.create(new ResourceNotFoundError());
		}

		const question = await this.questionsRepository.findById(
			answer.questionId.toValue(),
		);

		if (!question) {
			return Left.create(new ResourceNotFoundError());
		}

		if (request.authorId !== question.authorId.toValue()) {
			return Left.create(new NotAllowedError());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return Right.create({ question });
	}
}
