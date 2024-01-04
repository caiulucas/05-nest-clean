import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer';
import { faker } from '@faker-js/faker';

export function makeAnswer(
	override?: Partial<AnswerProps>,
	id?: UniqueEntityId,
): Answer {
	return Answer.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}
