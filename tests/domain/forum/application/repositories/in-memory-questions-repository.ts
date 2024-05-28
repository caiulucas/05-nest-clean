import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

const PAGE_SIZE = 20;

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[];

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {
		this.items = [];
	}

	async create(question: Question) {
		this.items.push(question);

		await this.questionAttachmentsRepository.createMany(
			question.attachments.currentItems,
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;

		await this.questionAttachmentsRepository.createMany(
			question.attachments.newItems,
		);

		await this.questionAttachmentsRepository.deleteMany(
			question.attachments.removedItems,
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(itemIndex, 1);

		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toValue(),
		);
	}

	async findById(id: string) {
		return this.items.find((item) => item.id.toValue() === id) ?? null;
	}

	async findBySlug(slug: string) {
		return this.items.find((item) => item.slug?.value === slug) ?? null;
	}

	async findManyRecent(params: PaginationParams) {
		return this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((params.page - 1) * PAGE_SIZE, params.page * PAGE_SIZE);
	}
}
