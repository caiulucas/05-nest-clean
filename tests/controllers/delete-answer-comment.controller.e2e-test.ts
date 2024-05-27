import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'tests/domain/forum/application/factories/make-answer';
import { AnswerCommentFactory } from 'tests/domain/forum/application/factories/make-answer-comment';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Delete Answer Comment (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let questionFactory: QuestionFactory;

	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				AnswerCommentFactory,
				AnswerFactory,
				QuestionFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[DELETE] /answers/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerComment = await answerCommentFactory.makePrismaAnswerComment({
			answerId: answer.id,
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/${answerComment.id.toValue()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: answerComment.id.toValue(),
			},
		});

		expect(commentOnDatabase).toBeFalsy();
	});
});
