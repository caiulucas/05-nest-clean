import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	AnswerComment,
	AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { answerCommentToPersistance } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswerComment(
	override?: Partial<AnswerCommentProps>,
	id?: UniqueEntityId,
): AnswerComment {
	return AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswerComment(
		data: Partial<AnswerCommentProps> = {},
	): Promise<AnswerComment> {
		const answerComment = makeAnswerComment(data);

		await this.prisma.comment.create({
			data: answerCommentToPersistance(answerComment),
		});

		return answerComment;
	}
}
