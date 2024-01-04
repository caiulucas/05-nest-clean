import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
describe('Create Question (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[POST] /questions', async () => {
		const user = await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: 'test!123',
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		const questions = [
			{
				authorId: user.id,
				title: 'Test Question 01',
				slug: 'test-question-01',
				content: 'Test content for test question 01',
			},
			{
				authorId: user.id,
				title: 'Test Question 02',
				slug: 'test-question-02',
				content: 'Test content for test question 02',
			},
		];

		await prisma.question.createMany({ data: questions });

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			questions: [
				expect.objectContaining(questions[0].title),
				expect.objectContaining(questions[1].title),
			],
		});
	});
});
