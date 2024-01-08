import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private readonly authenticateStudent: AuthenticateStudentUseCase,
	) {}

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const result = await this.authenticateStudent.execute({
			email: body.email,
			password: body.password,
		});

		if (result.isLeft()) {
			throw new Error();
		}

		return { access_token: result.value.accessToken };
	}
}
