import { type Either, Left, Right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import type { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import type { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import type { AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
	attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

@Injectable()
export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute(
		request: EditAnswerUseCaseRequest,
	): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(request.answerId);

		if (!answer) {
			return Left.create(new ResourceNotFoundError());
		}

		if (request.authorId !== answer.authorId.toValue()) {
			return Left.create(new NotAllowedError());
		}

		const currentAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(
				request.answerId,
			);

		const attachmentList = AnswerAttachmentList.create(currentAttachments);

		const attachments = request.attachmentsIds.map((attachmentId) =>
			AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			}),
		);

		attachmentList.update(attachments);

		answer.content = request.content;
		answer.attachments = attachmentList;

		await this.answersRepository.save(answer);

		return Right.create({ answer });
	}
}
