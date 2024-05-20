import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_FILE_SIZE = 4096;

@Controller('/attachments')
export class UploadAttachmentController {
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
		console.log(file);
	}
}
