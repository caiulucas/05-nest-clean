import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'tests/domain/forum/application/factories/make-student';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Upload attachment (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);

		app.init();
	});

	test('[POST] /attachments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toValue() });

		const response = await request(app.getHttpServer())
			.post('/attachments')
			.set('Authorization', `Bearer ${accessToken}`)
			.attach('file', './tests/assets/sample-upload.png');

		expect(response.statusCode).toBe(200);
	});
});
