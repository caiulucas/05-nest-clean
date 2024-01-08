import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { env } from '@/infra/env';
import { Injectable } from '@nestjs/common';
import {
	questionToDomain,
	questionToPersistance,
} from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(question: Question) {
		const data = questionToPersistance(question);

		await this.prisma.question.create({ data });
	}

	async save(question: Question) {
		const data = questionToPersistance(question);

		await this.prisma.question.update({ data, where: { id: data.id } });
	}

	async delete(question: Question) {
		const data = questionToPersistance(question);

		await this.prisma.question.delete({ where: { id: data.id } });
	}

	async findById(id: string) {
		const question = await this.prisma.question.findUnique({ where: { id } });

		return question ? questionToDomain(question) : null;
	}

	async findBySlug(slug: string) {
		const question = await this.prisma.question.findUnique({ where: { slug } });

		return question ? questionToDomain(question) : null;
	}

	async findManyRecent(params: PaginationParams) {
		const questions = await this.prisma.question.findMany({
			orderBy: { createdAt: 'desc' },
			take: env.PAGE_SIZE,
			skip: env.PAGE_SIZE * (params.page - 1),
		});

		return questions.map((question) => questionToDomain(question));
	}
}