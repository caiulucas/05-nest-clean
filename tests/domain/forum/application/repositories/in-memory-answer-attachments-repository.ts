import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	public items: AnswerAttachment[];

	constructor() {
		this.items = [];
	}

	async findManyByAnswerId(answerId: string) {
		return this.items.filter((item) => item.answerId.toValue() === answerId);
	}

	async deleteManyByAnswerId(answerId: string) {
		this.items = this.items.filter(
			(item) => item.answerId.toValue() !== answerId,
		);
	}
}
