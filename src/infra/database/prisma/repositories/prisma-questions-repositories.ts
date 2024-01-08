import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(question: Question) {}

	async save(question: Question) {}

	async delete(question: Question) {}

	async findById(id: string) {
		const question = await this.prisma.question.findUnique({ where: { id } });

		return question ? PrismaQuestionMapper.toDomain(question) : null;
	}

	async findBySlug(slug: string) {}

	async findManyRecent(params: PaginationParams) {}
}
