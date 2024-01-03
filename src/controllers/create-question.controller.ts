import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		await this.prisma.question.create({
			data: {
				authorId: user.sub,
				title: body.title,
				content: body.content,
				slug: this.convertToSlug(body.title),
			},
		});
	}

	private convertToSlug(text: string) {
		const slug = text
			.normalize('NFKC')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/_/g, '-')
			.replace(/--+/g, '-')
			.replace(/-$/, '');

		return slug;
	}
}
