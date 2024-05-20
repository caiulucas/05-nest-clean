import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import type { Prisma, Question as PrismaQuestion } from '@prisma/client';

export function questionToDomain(raw: PrismaQuestion): Question {
	return Question.create(
		{
			title: raw.title,
			content: raw.content,
			authorId: new UniqueEntityId(raw.authorId),
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			slug: Slug.create(raw.slug),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		},
		new UniqueEntityId(raw.id),
	);
}

export function questionToPersistance(
	raw: Question,
): Prisma.QuestionUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		authorId: raw.authorId.toValue(),
		bestAnswerId: raw.bestAnswerId?.toValue(),
		title: raw.title,
		content: raw.content,
		slug: raw.slug.value,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
	};
}
