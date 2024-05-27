import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';
import { attachmentToPersistance } from '../mappers/prisma-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(attachment: Attachment) {
		const data = attachmentToPersistance(attachment);

		await this.prisma.attachment.create({ data });
	}
}
