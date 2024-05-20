import type { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { questionPresenterToHttp } from '../presenters/question-presenter';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions')
export class FetchRecentQuestionsController {
	constructor(
		private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
	) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: number) {
		const result = await this.fetchRecentQuestions.execute({ page });

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const questions = result.value.questions.map(questionPresenterToHttp);

		return { questions };
	}
}
