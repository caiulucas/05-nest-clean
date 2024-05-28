import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'tests/domain/forum/application/factories/make-attachment';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Create Question (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const firstAttachment = await attachmentFactory.makePrismaAttachment();
		const secondAttachment = await attachmentFactory.makePrismaAttachment();

		const question = {
			title: 'Test Question',
			content: 'Test content for test question',
			attachments: [
				firstAttachment.id.toValue(),
				secondAttachment.id.toValue(),
			],
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

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: { questionId: questionOnDatabase?.id },
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});
