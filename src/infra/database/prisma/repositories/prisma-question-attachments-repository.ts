import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import {
	questionAttachmentToDomain,
	questionAttachmentToPersistanceUpdateMany,
} from '../mappers/prisma-question-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async createMany(attachments: QuestionAttachment[]) {
		if (attachments.length === 0) {
			return Promise.resolve();
		}

		await this.prisma.attachment.updateMany(
			questionAttachmentToPersistanceUpdateMany(attachments),
		);
	}

	async deleteMany(attachments: QuestionAttachment[]) {
		if (attachments.length === 0) {
			return Promise.resolve();
		}

		const attachmentsIds = attachments.map((attachment) =>
			attachment.id.toValue(),
		);

		await this.prisma.attachment.deleteMany({
			where: { id: { in: attachmentsIds } },
		});
	}

	async findManyByQuestionId(questionId: string) {
		const questionAttachments = await this.prisma.attachment.findMany({
			where: { questionId },
		});

		return questionAttachments.map(questionAttachmentToDomain);
	}

	async deleteManyByQuestionId(questionId: string) {
		await this.prisma.attachment.deleteMany({
			where: { questionId },
		});
	}
}
