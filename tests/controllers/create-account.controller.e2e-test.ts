import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Create account (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		app.init();
	});

	test('[POST] /accounts', async () => {
		const user = {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'test!123',
		};

		const response = await request(app.getHttpServer())
			.post('/accounts')
			.send(user);

		expect(response.statusCode).toBe(201);

		const userOnDatabase = await prisma.user.findUnique({
			where: { email: user.email },
		});

		expect(userOnDatabase).toBeTruthy();
	});
});
