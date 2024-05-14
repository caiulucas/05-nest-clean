import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import type { Comment as PrismaComment } from '@prisma/client';

export function questionCommentToDomain(
	raw: PrismaComment,
): QuestionAttachment {
	if (!raw.questionId) {
		throw new Error('Invalid attachment type.');
	}

	return QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(raw.questionId),
			attachmentId: new UniqueEntityId(raw.id),
		},
		new UniqueEntityId(raw.id),
	);
}
