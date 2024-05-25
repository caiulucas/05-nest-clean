import {
	UploadParams,
	Uploader,
} from '@/domain/forum/application/storage/uploader';
import { faker } from '@faker-js/faker';

interface Upload {
	fileName: string;
	url: string;
}

export class FakeUploader implements Uploader {
	public uploads: Upload[] = [];

	async upload(params: UploadParams): Promise<{ url: string }> {
		const url = faker.internet.url();

		this.uploads.push({ fileName: params.fileName, url });

		return { url };
	}
}
