import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { Injectable } from '@nestjs/common';
import { questionAttachmentToDomain } from '../mappers/prisma-question-attachment-mapper';
import type { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

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
