import { Either, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
	attachmentIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer;
	}
>;

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute(
		request: AnswerQuestionUseCaseRequest,
	): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			...request,
			authorId: new UniqueEntityId(request.instructorId),
			questionId: new UniqueEntityId(request.questionId),
		});

		const attachments = request.attachmentIds.map((attachmentId) =>
			AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			}),
		);

		answer.attachments = AnswerAttachmentList.create(attachments);

		await this.answersRepository.create(answer);

		return Right.create({ answer });
	}
}
