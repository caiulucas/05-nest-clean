import { type Either, Left, Right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Student } from '../../enterprise/entities/student';
import type { HashGenerator } from '../cryptography/hash-generator';
import type { StudentsRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

interface RegisterStudentUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

type RegisterStudentUseCaseResponse = Either<
	StudentAlreadyExistsError,
	{
		student: Student;
	}
>;

@Injectable()
export class RegisterStudentUseCase {
	constructor(
		private readonly studentsRepository: StudentsRepository,
		private readonly hashGenerator: HashGenerator,
	) {}

	async execute(
		request: RegisterStudentUseCaseRequest,
	): Promise<RegisterStudentUseCaseResponse> {
		const studentWithSameEmail = await this.studentsRepository.findByEmail(
			request.email,
		);

		if (studentWithSameEmail) {
			return Left.create(new StudentAlreadyExistsError(request.email));
		}

		const hashedPassword = await this.hashGenerator.hash(request.password);

		const student = Student.create({
			name: request.name,
			email: request.email,
			password: hashedPassword,
		});

		await this.studentsRepository.create(student);

		return Right.create({ student });
	}
}
