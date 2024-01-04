import { Either, Left, Right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	Record<string, never>
>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute(
		request: DeleteAnswerCommentUseCaseRequest,
	): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentsRepository.findById(
			request.answerCommentId,
		);

		if (!answerComment) {
			return Left.create(new ResourceNotFoundError());
		}

		if (answerComment.authorId.toValue() !== request.authorId) {
			return Left.create(new NotAllowedError());
		}

		await this.answerCommentsRepository.delete(answerComment);

		return Right.create({});
	}
}
