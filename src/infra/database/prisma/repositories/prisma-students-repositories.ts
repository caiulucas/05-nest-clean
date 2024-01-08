import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import {
	studentToDomain,
	studentToPersistance,
} from '../mappers/prisma-student-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
	constructor(private readonly prisma: PrismaService) {}
	async findByEmail(email: string) {
		const student = await this.prisma.user.findUnique({ where: { email } });
		return student ? studentToDomain(student) : null;
	}

	async create(student: Student) {
		const data = studentToPersistance(student);

		await this.prisma.user.create({ data });
	}
}
