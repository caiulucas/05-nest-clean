import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Student,
	StudentProps,
} from '@/domain/forum/enterprise/entities/student';
import { studentToPersistance } from '@/infra/database/prisma/mappers/prisma-student-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeStudent(
	override?: Partial<StudentProps>,
	id?: UniqueEntityId,
) {
	return Student.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	);
}

@Injectable()
export class StudentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
		const student = makeStudent(data);

		await this.prisma.user.create({
			data: studentToPersistance(student),
		});

		return student;
	}
}
