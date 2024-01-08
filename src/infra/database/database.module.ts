import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repositories';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repositories';

@Module({
	providers: [
		PrismaService,
		{ provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
		{ provide: StudentsRepository, useClass: PrismaStudentsRepository },
		PrismaQuestionsRepository,
	],
	exports: [PrismaService, QuestionsRepository, StudentsRepository],
})
export class DatabaseModule {}
