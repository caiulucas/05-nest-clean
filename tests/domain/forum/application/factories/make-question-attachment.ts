import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeQuestionAttachment(
	override?: Partial<QuestionAttachmentProps>,
	id?: UniqueEntityId,
): QuestionAttachment {
	return QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	);
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionAttachment(
		data: Partial<QuestionAttachmentProps> = {},
	): Promise<QuestionAttachment> {
		const attachment = makeQuestionAttachment(data);

		await this.prisma.attachment.update({
			where: { id: attachment.attachmentId.toValue() },
			data: { questionId: attachment.questionId.toValue() },
		});

		return attachment;
	}
}
