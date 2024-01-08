import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common';
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
			const error = result.value;

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return { access_token: result.value.accessToken };
	}
}
