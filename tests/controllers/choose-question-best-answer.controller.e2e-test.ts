import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'tests/domain/forum/application/factories/make-answer';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';

describe('Choose Question Best Answer (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[PATCH] /answers/:answerId/choose-as-best', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.patch(`/answers/${answer.id.toValue()}/choose-as-best`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findUnique({
			where: {
				id: question.id.toValue(),
			},
		});

		expect(questionOnDatabase?.bestAnswerId).toBe(answer.id.toValue());
	});
});
