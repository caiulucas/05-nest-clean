import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repositories';

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		// PrismaAnswerAttachmentsRepository,
		// PrismaAnswerCommentsRepository,
		// PrismaAnswersRepository,
		// PrismaQuestionAttachments,
		// PrismaQuestionCommentsRepository,
		PrismaQuestionsRepository,
	],
	exports: [
		PrismaService,
		// PrismaAnswerAttachmentsRepository,
		// PrismaAnswerCommentsRepository,
		// PrismaAnswersRepository,
		// PrismaQuestionAttachments,
		// PrismaQuestionCommentsRepository,
		QuestionsRepository,
	],
})
export class DatabaseModule {}
