import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private readonly prisma: PrismaService,
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
