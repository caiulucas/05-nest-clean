import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import {
	answerToDomain,
	answerToPersistance,
} from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

const PAGE_SIZE = 20;

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(answer: Answer) {
		const data = answerToPersistance(answer);

		await this.prisma.answer.create({ data });
	}
	async save(answer: Answer) {
		const data = answerToPersistance(answer);

		await this.prisma.question.update({ data, where: { id: data.id } });
	}

	async delete(answer: Answer) {
		await this.prisma.answer.delete({ where: { id: answer.id.toString() } });
	}

	async findById(id: string) {
		const answer = await this.prisma.answer.findUnique({ where: { id } });

		return answer ? answerToDomain(answer) : null;
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const answers = await this.prisma.answer.findMany({
			where: { questionId },
			orderBy: { createdAt: 'desc' },
			take: PAGE_SIZE,
			skip: PAGE_SIZE * (params.page - 1),
		});

		return answers.map((answer) => answerToDomain(answer));
	}
}
