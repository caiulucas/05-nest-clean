import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Question,
	QuestionProps,
} from '@/domain/forum/enterprise/entities/question';
import { questionToPersistance } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class QuestionFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestion(
		data: Partial<QuestionProps> = {},
	): Promise<Question> {
		const question = makeQuestion(data);

		await this.prisma.question.create({
			data: questionToPersistance(question),
		});

		return question;
	}
}
