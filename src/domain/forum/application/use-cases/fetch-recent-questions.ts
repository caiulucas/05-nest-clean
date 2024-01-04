import { Either, Right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsRequest {
	page: number;
}

type FetchRecentQuestionsResponse = Either<
	null,
	{
		questions: Question[];
	}
>;
export class FetchRecentQuestions {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute(
		data: FetchRecentQuestionsRequest,
	): Promise<FetchRecentQuestionsResponse> {
		const questions = await this.questionsRepository.findManyRecent({
			page: data.page,
		});

		return Right.create({ questions });
	}
}
