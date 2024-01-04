import { Either, Left, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment;
	}
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute(
		request: CommentOnQuestionUseCaseRequest,
	): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(
			request.questionId,
		);

		if (!question) {
			return Left.create(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			...request,
			authorId: new UniqueEntityId(request.authorId),
			questionId: question.id,
		});

		await this.questionCommentsRepository.create(questionComment);

		return Right.create({ questionComment });
	}
}
