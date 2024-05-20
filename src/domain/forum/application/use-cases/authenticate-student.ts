import { type Either, Left, Right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import type { Encrypter } from '../cryptography/encrypter';
import type { HashComparer } from '../cryptography/hash-comparer';
import type { StudentsRepository } from '../repositories/students-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
	WrongCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private readonly studentsRepository: StudentsRepository,
		private readonly hashComparer: HashComparer,
		private readonly encrypter: Encrypter,
	) {}

	async execute(
		request: AuthenticateStudentUseCaseRequest,
	): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentsRepository.findByEmail(request.email);

		if (!student) {
			return Left.create(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(
			request.password,
			student.password,
		);

		if (!isPasswordValid) {
			return Left.create(new WrongCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toValue(),
		});

		return Right.create({ accessToken });
	}
}
