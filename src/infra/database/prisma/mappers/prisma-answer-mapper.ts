import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Prisma, Answer as PrismaAnswer } from '@prisma/client';

export function answerToDomain(raw: PrismaAnswer): Answer {
	return Answer.create(
		{
			content: raw.content,
			questionId: new UniqueEntityId(raw.questionId),
			authorId: new UniqueEntityId(raw.authorId),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		},
		new UniqueEntityId(raw.id),
	);
}

export function answerToPersistance(
	raw: Answer,
): Prisma.AnswerUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		questionId: raw.questionId.toValue(),
		authorId: raw.authorId.toValue(),
		content: raw.content,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
	};
}
