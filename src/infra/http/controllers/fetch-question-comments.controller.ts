import type { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common';
import { z } from 'zod';
import { commentPresenterToHttp } from '../presenters/comment-presenter';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(
		private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
	) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: number,
		@Param('questionId') questionId: string,
	) {
		const result = await this.fetchQuestionComments.execute({
			page,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const comments = result.value.questionComments.map(commentPresenterToHttp);

		return { comments };
	}
}
