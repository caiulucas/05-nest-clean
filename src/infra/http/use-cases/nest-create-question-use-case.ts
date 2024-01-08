import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestCreateQuestionUseCase extends CreateQuestionUseCase {}
