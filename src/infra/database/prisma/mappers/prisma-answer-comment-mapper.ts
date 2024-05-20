import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import type { Prisma, Comment as PrismaComment } from '@prisma/client';

export function answerCommentToDomain(raw: PrismaComment): AnswerComment {
	if (!raw.answerId) {
		throw new Error('Invalid comment type.');
	}

	return AnswerComment.create(
		{
			content: raw.content,
			authorId: new UniqueEntityId(raw.authorId),
			answerId: new UniqueEntityId(raw.answerId),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		},
		new UniqueEntityId(raw.id),
	);
}

export function answerCommentToPersistance(
	raw: AnswerComment,
): Prisma.CommentUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		answerId: raw.answerId.toValue(),
		authorId: raw.authorId.toValue(),
		content: raw.content,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
	};
}
