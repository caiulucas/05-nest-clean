import type { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

const CommentOnQuestionBodySchema = z.object({
	content: z.string(),
});

type commentOnQuestionBodySchema = z.infer<typeof CommentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(CommentOnQuestionBodySchema);

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
	constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: commentOnQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string,
	) {
		const result = await this.commentOnQuestion.execute({
			content: body.content,
			questionId,
			authorId: user.sub,
		});

		if (result.isLeft()) {
			return new BadRequestException();
		}
	}
}
