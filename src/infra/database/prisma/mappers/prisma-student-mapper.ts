import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import type { Prisma, User as PrismaUser } from '@prisma/client';

export function studentToDomain(raw: PrismaUser): Student {
	return Student.create(
		{
			name: raw.name,
			email: raw.email,
			password: raw.password,
		},
		new UniqueEntityId(raw.id),
	);
}

export function studentToPersistance(
	raw: Student,
): Prisma.UserUncheckedCreateInput {
	return {
		id: raw.id.toValue(),
		name: raw.name,
		email: raw.email,
		password: raw.password,
	};
}
