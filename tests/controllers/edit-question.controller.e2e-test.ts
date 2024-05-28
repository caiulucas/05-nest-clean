import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import e from 'express';
import request from 'supertest';
import { AttachmentFactory } from 'tests/domain/forum/application/factories/make-attachment';
import { QuestionFactory } from 'tests/domain/forum/application/factories/make-question';
import { QuestionAttachmentFactory } from 'tests/domain/forum/application/factories/make-question-attachment';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Edit Question (E2E)', () => {
	let app: INestApplication;

	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const firstAttachment = await attachmentFactory.makePrismaAttachment();
		const secondAttachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: firstAttachment.id,
			questionId: question.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: secondAttachment.id,
			questionId: question.id,
		});

		const thirdAttachment = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id.toValue()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Test Question',
				content: 'New test content for test question',
				attachments: [
					firstAttachment.id.toValue(),
					thirdAttachment.id.toValue(),
				],
			});

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: 'New Test Question',
				content: 'New test content for test question',
			},
		});

		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual([
			expect.objectContaining({
				id: firstAttachment.id.toValue(),
			}),
			expect.objectContaining({
				id: thirdAttachment.id.toValue(),
			}),
		]);
	});
});
