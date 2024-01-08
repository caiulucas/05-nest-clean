import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { questionPresenterToHttp } from '../presenters/question-presenter';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(
		private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
	) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: number) {
		const result = await this.fetchRecentQuestions.execute({ page });

		if (result.isLeft()) {
			throw new Error();
		}

		const questions = result.value.questions.map((question) =>
			questionPresenterToHttp(question),
		);

		return { questions };
	}
}
