import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: number) {
		const questions = await this.prisma.question.findMany({
			orderBy: { createdAt: 'desc' },
			take: 20,
			skip: (page - 1) * 20,
		});

		return { questions };
	}
}
