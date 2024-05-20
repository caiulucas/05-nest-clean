import type { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
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

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(
		private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
	) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: number,
		@Param('answerId') answerId: string,
	) {
		const result = await this.fetchAnswerComments.execute({
			page,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const comments = result.value.answerComments.map(commentPresenterToHttp);

		return { comments };
	}
}
