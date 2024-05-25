import { InvalidAttachmentFileTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-file-type-error';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-attachments-repository';
import { FakeUploader } from '../storage/fake-uploader';

describe('Upload And Create Use Case', () => {
	let attachmentsRepository: InMemoryAttachmentsRepository;
	let uploader: FakeUploader;
	let sut: UploadAndCreateAttachmentUseCase;

	beforeEach(() => {
		attachmentsRepository = new InMemoryAttachmentsRepository();
		uploader = new FakeUploader();
		sut = new UploadAndCreateAttachmentUseCase(attachmentsRepository, uploader);
	});

	it('should be able to upload and create an attachment', async () => {
		const result = await sut.execute({
			fileName: 'profile.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: attachmentsRepository.items[0],
		});
	});

	it('should not be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			fileName: 'profile.mp3',
			fileType: 'audio/mpeg',
			body: Buffer.from(''),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAttachmentFileTypeError);
	});
});
