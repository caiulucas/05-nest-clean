import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private readonly createQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	) {
		await this.createQuestion.execute({
			questionId,
			title: body.title,
			content: body.content,
			authorId: user.sub,
			attachmentsIds: [],
		});
	}
}
