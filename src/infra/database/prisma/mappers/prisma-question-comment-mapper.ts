import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export function questionCommentToDomain(raw: PrismaComment): QuestionComment {
	if (!raw.questionId) {
		throw new Error('Invalid comment type.');
	}

	return QuestionComment.create(
		{
			content: raw.content,
			authorId: new UniqueEntityId(raw.authorId),
			questionId: new UniqueEntityId(raw.questionId),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		},
		new UniqueEntityId(raw.id),
	);
}

export function questionCommentToPersistance(
	raw: QuestionComment,
): Prisma.CommentUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		questionId: raw.questionId.toValue(),
		authorId: raw.authorId.toValue(),
		content: raw.content,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
	};
}
