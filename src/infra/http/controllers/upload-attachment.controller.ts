import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import {
	BadRequestException,
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_FILE_SIZE = 4096 * 1000;

@Controller('/attachments')
export class UploadAttachmentController {
	constructor(
		private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async handle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
					new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const result = await this.uploadAndCreateAttachment.execute({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
		});

		if (result.isLeft()) {
			const error = result.value;

			throw new BadRequestException(error.message);
		}

		const { attachment } = result.value;

		return { attachmentId: attachment.id.toValue() };
	}
}
