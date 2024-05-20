import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { Injectable } from '@nestjs/common';
import { answerAttachmentToDomain } from '../mappers/prisma-answer-attachment-mapper';
import type { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findManyByAnswerId(answerId: string) {
		const answerAttachments = await this.prisma.attachment.findMany({
			where: { answerId },
		});

		return answerAttachments.map(answerAttachmentToDomain);
	}

	async deleteManyByAnswerId(answerId: string) {
		await this.prisma.attachment.deleteMany({
			where: { answerId },
		});
	}
}
