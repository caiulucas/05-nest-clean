import { Either, Left, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async execute(
		request: EditQuestionUseCaseRequest,
	): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(
			request.questionId,
		);

		if (!question) {
			return Left.create(new ResourceNotFoundError());
		}

		if (request.authorId !== question.authorId.toValue()) {
			return Left.create(new NotAllowedError());
		}

		const currentAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(
				request.questionId,
			);

		const attachmentList = QuestionAttachmentList.create(currentAttachments);

		const attachments = request.attachmentsIds.map((attachmentId) =>
			QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			}),
		);

		attachmentList.update(attachments);

		question.attachments = attachmentList;
		question.title = request.title;
		question.content = request.content;

		await this.questionsRepository.save(question);

		return Right.create({ question });
	}
}
