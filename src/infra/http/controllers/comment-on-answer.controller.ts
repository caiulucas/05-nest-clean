import type { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
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

const CommentOnAnswerBodySchema = z.object({
	content: z.string(),
});

type commentOnAnswerBodySchema = z.infer<typeof CommentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(CommentOnAnswerBodySchema);

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: commentOnAnswerBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const result = await this.commentOnAnswer.execute({
			content: body.content,
			answerId,
			authorId: user.sub,
		});

		if (result.isLeft()) {
			return new BadRequestException();
		}
	}
}
