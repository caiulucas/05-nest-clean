import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Question,
	QuestionProps,
} from '@/domain/forum/enterprise/entities/question';
import { faker } from '@faker-js/faker';

export function makeQuestion(
	override?: Partial<QuestionProps>,
	id?: UniqueEntityId,
) {
	const title = faker.lorem.sentence();

	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			title,
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return question;
}
