import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import {
	questionCommentToDomain,
	questionCommentToPersistance,
} from '../mappers/prisma-question-comment-mapper';
import { PrismaService } from '../prisma.service';

const PAGE_SIZE = 20;

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async create(comment: QuestionComment) {
		const data = questionCommentToPersistance(comment);

		await this.prisma.comment.create({ data });
	}

	async save(comment: QuestionComment) {
		const data = questionCommentToPersistance(comment);

		await this.prisma.comment.update({ data, where: { id: data.id } });
	}

	async delete(comment: QuestionComment) {
		await this.prisma.comment.delete({ where: { id: comment.id.toValue() } });
	}

	async findById(id: string) {
		const comment = await this.prisma.comment.findUnique({ where: { id } });

		return comment ? questionCommentToDomain(comment) : null;
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const comments = await this.prisma.comment.findMany({
			where: { questionId },
			orderBy: { createdAt: 'desc' },
			take: PAGE_SIZE,
			skip: PAGE_SIZE * (params.page - 1),
		});

		return comments.map((comment) => questionCommentToDomain(comment));
	}
}
