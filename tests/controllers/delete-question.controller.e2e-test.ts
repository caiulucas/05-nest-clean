import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Delete Question (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[DELETE] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/questions/${question.id.toValue()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: question.title,
				content: question.content,
			},
		});

		expect(questionOnDatabase).toBeFalsy();
	});
});
