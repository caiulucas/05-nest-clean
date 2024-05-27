import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'tests/domain/forum/application/factories/make-answer';
import { AnswerCommentFactory } from 'tests/domain/forum/application/factories/make-answer-comment';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Fetch Answers AnswerComments (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				AnswerFactory,
				AnswerCommentFactory,
				QuestionFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[GET] /answers/:answerId/answerComments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerComments = await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
			}),
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id.toValue()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({ content: answerComments[0].content }),
				expect.objectContaining({ content: answerComments[1].content }),
			]),
		});
	});
});
