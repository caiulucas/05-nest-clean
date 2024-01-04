import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
describe('Fetch Recent Questions (E2E)', () => {
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

	test('[GET] /questions', async () => {
		const user = await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: 'test!123',
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		const question = {
			title: 'Test Question',
			content: 'Test content for test question',
		};

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send(question);

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: { title: question.title, content: question.content },
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});