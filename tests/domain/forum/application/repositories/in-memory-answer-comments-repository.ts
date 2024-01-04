import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

const PAGE_SIZE = 20;
export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[];

	constructor() {
		this.items = [];
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment);
	}

	async delete(answerComment: AnswerComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		);

		this.items.splice(itemIndex, 1);
	}

	async findById(id: string): Promise<AnswerComment | null> {
		return this.items.find((item) => item.id.toValue() === id) ?? null;
	}

	async findManyByAnswerId(answerId: string, params: PaginationParams) {
		return (
			this.items.filter((item) => item.answerId.toValue() === answerId) ?? null
		).slice((params.page - 1) * PAGE_SIZE, params.page * PAGE_SIZE);
	}
}
