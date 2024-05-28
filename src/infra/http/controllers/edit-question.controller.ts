import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common';
import { z } from 'zod';

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private readonly editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	) {
		const result = await this.editQuestion.execute({
			questionId,
			title: body.title,
			content: body.content,
			authorId: user.sub,
			attachmentsIds: body.attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
