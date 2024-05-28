import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

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

export function questionAttachmentToPersistanceUpdateMany(
	attachments: QuestionAttachment[],
): Prisma.AttachmentUpdateManyArgs {
	const attachmentsIds = attachments.map((attachment) =>
		attachment.attachmentId.toValue(),
	);

	return {
		where: { id: { in: attachmentsIds } },
		data: { questionId: attachments[0].questionId.toValue() },
	};
}
