import { type Either, Left, Right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';
import { InvalidAttachmentFileTypeError } from './errors/invalid-attachment-file-type-error';

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentFileTypeError,
	{ attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private readonly attachmentsRepository: AttachmentsRepository,
		private uploader: Uploader,
	) {}

	async execute(
		request: UploadAndCreateAttachmentUseCaseRequest,
	): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(request.fileType)) {
			return Left.create(new InvalidAttachmentFileTypeError(request.fileType));
		}

		const { url } = await this.uploader.upload(request);

		const attachment = Attachment.create({
			title: request.fileName,
			url,
		});

		await this.attachmentsRepository.create(attachment);

		return Right.create({
			attachment,
		});
	}
}
