import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { QuestionCommentFactory } from 'tests/domain/forum/application/factories/make-question-comment';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Fetch Questions QuestionComments (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[GET] /questions/:questionId/questionComments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionComments = await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
			}),
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toValue()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({ content: questionComments[0].content }),
				expect.objectContaining({ content: questionComments[1].content }),
			]),
		});
	});
});
