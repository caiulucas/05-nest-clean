import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Attachment,
	AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';
import { attachmentToPersistance } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAttachment(
	override?: Partial<AttachmentProps>,
	id?: UniqueEntityId,
) {
	return Attachment.create(
		{
			title: faker.lorem.words(3),
			url: faker.internet.url(),
			...override,
		},
		id,
	);
}

@Injectable()
export class AttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAttachment(
		data: Partial<AttachmentProps> = {},
	): Promise<Attachment> {
		const attachment = makeAttachment(data);

		await this.prisma.attachment.create({
			data: attachmentToPersistance(attachment),
		});

		return attachment;
	}
}
