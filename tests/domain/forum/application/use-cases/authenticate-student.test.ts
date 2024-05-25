import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { beforeEach, describe, expect, it } from 'vitest';
import { FakeEncrypter } from '../cryptography/fake-encrypter';
import { FakeHasher } from '../cryptography/fake-hasher';
import { makeStudent } from '../factories/make-student';
import { InMemoryStudentsRepository } from '../repositories/in-memory-students-repository';

describe('Authenticate Student Use Case', () => {
	let studentsRepository: InMemoryStudentsRepository;
	let hasher: FakeHasher;
	let encrypter: FakeEncrypter;
	let sut: AuthenticateStudentUseCase;

	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository();
		hasher = new FakeHasher();
		encrypter = new FakeEncrypter();
		sut = new AuthenticateStudentUseCase(studentsRepository, hasher, encrypter);
	});

	it('should be able to authenticate a student', async () => {
		const password = '123@test';
		const student = makeStudent({ password: await hasher.hash(password) });

		await studentsRepository.create(student);

		const result = await sut.execute({
			email: student.email,
			password,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({ accessToken: expect.any(String) });
	});
});
