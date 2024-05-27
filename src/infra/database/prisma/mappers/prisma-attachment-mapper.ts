import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Prisma } from '@prisma/client';

// export function attachmentToDomain(raw: PrismaUser): Attachment {
// 	return Attachment.create(
// 		{
// 			name: raw.name,
// 			email: raw.email,
// 			password: raw.password,
// 		},
// 		new UniqueEntityId(raw.id),
// 	);
// }
//
export function attachmentToPersistance(
	raw: Attachment,
): Prisma.AttachmentUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		title: raw.title,
		url: raw.url,
	};
}
