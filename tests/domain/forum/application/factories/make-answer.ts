import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer';
import { answerToPersistance } from '@/infra/database/prisma/mappers/prisma-answer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class AnswerFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const answer = makeAnswer(data);

		await this.prisma.answer.create({
			data: answerToPersistance(answer),
		});

		return answer;
	}
}
