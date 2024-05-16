import { Either, Left, Right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	Record<string, never>
>;

@Injectable()
export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute(
		request: DeleteAnswerUseCaseRequest,
	): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(request.answerId);

		if (!answer) {
			return Left.create(new ResourceNotFoundError());
		}

		if (request.authorId !== answer.authorId.toValue()) {
			return Left.create(new NotAllowedError());
		}

		await this.answersRepository.delete(answer);

		return Right.create({});
	}
}
