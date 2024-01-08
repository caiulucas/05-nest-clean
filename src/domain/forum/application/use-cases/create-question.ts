import { Either, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
	null,
	{
		question: Question;
	}
>;

@Injectable()
export class CreateQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute(
		request: CreateQuestionUseCaseRequest,
	): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			...request,
			authorId: new UniqueEntityId(request.authorId),
		});

		const attachments = request.attachmentsIds.map((attachmentId) =>
			QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			}),
		);

		question.attachments = QuestionAttachmentList.create(attachments);

		await this.questionsRepository.create(question);

		return Right.create({ question });
	}
}
