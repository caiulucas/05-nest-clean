import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import {
	answerCommentToDomain,
	answerCommentToPersistance,
} from '../mappers/prisma-answer-comment-mapper';
import { PrismaService } from '../prisma.service';

const PAGE_SIZE = 20;

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async create(comment: AnswerComment) {
		const data = answerCommentToPersistance(comment);

		await this.prisma.comment.create({ data });
	}

	async save(comment: AnswerComment) {
		const data = answerCommentToPersistance(comment);

		await this.prisma.comment.update({ data, where: { id: data.id } });
	}

	async delete(comment: AnswerComment) {
		await this.prisma.comment.delete({ where: { id: comment.id.toValue() } });
	}

	async findById(id: string) {
		const comment = await this.prisma.comment.findUnique({ where: { id } });

		return comment ? answerCommentToDomain(comment) : null;
	}

	async findManyByAnswerId(answerId: string, params: PaginationParams) {
		const comments = await this.prisma.comment.findMany({
			where: { answerId },
			orderBy: { createdAt: 'desc' },
			take: PAGE_SIZE,
			skip: PAGE_SIZE * (params.page - 1),
		});

		return comments.map((comment) => answerCommentToDomain(comment));
	}
}
