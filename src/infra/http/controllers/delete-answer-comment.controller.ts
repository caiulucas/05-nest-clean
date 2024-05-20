import type { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common';

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
	constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') answerCommentId: string,
	) {
		const result = await this.deleteAnswerComment.execute({
			authorId: user.sub,
			answerCommentId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
