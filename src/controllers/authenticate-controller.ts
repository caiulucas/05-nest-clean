import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/session')
export class AuthenticateController {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly jwt: JwtService,
	) {}

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const user = await this.prisma.user.findUnique({
			where: { email: body.email },
		});

		if (!user) {
			throw new UnauthorizedException('User credentials does not match.');
		}

		const isPasswordValid = await compare(body.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('User credentials does not match.');
		}

		const accessToken = this.jwt.sign({ sub: user.id });

		return { access_token: accessToken };
	}
}
