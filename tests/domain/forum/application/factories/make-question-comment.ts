import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionComment,
	QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';
import { questionCommentToPersistance } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestionComment(
	override?: Partial<QuestionCommentProps>,
	id?: UniqueEntityId,
): QuestionComment {
	return QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionComment(
		data: Partial<QuestionCommentProps> = {},
	): Promise<QuestionComment> {
		const questionComment = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: questionCommentToPersistance(questionComment),
		});

		return questionComment;
	}
}
