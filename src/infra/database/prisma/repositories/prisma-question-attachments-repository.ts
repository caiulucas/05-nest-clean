import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachments
	implements QuestionAttachmentsRepository
{
	async findManyByQuestionId(questionId: string) {
		throw new Error('Method not implemented.');
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
