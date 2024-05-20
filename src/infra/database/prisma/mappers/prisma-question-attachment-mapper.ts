import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Attachment as PrismaAttachment } from '@prisma/client';

export function questionAttachmentToDomain(
	raw: PrismaAttachment,
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
