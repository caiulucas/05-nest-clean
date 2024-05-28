import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[];

	constructor() {
		this.items = [];
	}

	async createMany(attachments: QuestionAttachment[]) {
		this.items.push(...attachments);
	}

	async deleteMany(attachments: QuestionAttachment[]) {
		this.items = this.items.filter((item) => !attachments.includes(item));
	}

	async findManyByQuestionId(questionId: string) {
		return this.items.filter(
			(item) => item.questionId.toValue() === questionId,
		);
	}

	async deleteManyByQuestionId(questionId: string) {
		this.items = this.items.filter(
			(item) => item.questionId.toValue() !== questionId,
		);
	}
}
