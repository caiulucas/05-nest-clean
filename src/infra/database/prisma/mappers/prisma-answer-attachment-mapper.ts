import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import type { Comment as PrismaComment } from '@prisma/client';

export function questionCommentToDomain(raw: PrismaComment): AnswerAttachment {
	if (!raw.questionId) {
		throw new Error('Invalid attachment type.');
	}

	return AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(raw.questionId),
			attachmentId: new UniqueEntityId(raw.id),
		},
		new UniqueEntityId(raw.id),
	);
}
