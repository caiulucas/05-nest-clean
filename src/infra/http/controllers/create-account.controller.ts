import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
	constructor(private readonly registerStudent: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const result = await this.registerStudent.execute({
			name: body.name,
			email: body.email,
			password: body.password,
		});

		if (result.isLeft()) {
			throw new Error();
		}
	}
}
