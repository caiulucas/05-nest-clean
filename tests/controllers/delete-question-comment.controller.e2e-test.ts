import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { QuestionCommentFactory } from 'tests/domain/forum/application/factories/make-question-comment';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';

describe('Delete Question Comment (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionCommentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[DELETE] /questions/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionComment =
			await questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
			});

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionComment.id.toValue()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: questionComment.id.toValue(),
			},
		});

		expect(commentOnDatabase).toBeFalsy();
	});
});