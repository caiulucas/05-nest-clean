import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { beforeEach, describe, expect, it } from 'vitest';
import { FakeHasher } from '../cryptography/fake-hasher';
import { InMemoryStudentsRepository } from '../repositories/in-memory-students-repository';

describe('Register Student Use Case', () => {
	let studentsRepository: InMemoryStudentsRepository;
	let hasher: FakeHasher;
	let sut: RegisterStudentUseCase;

	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository();
		hasher = new FakeHasher();
		sut = new RegisterStudentUseCase(studentsRepository, hasher);
	});

	it('should be able to register a new student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123@test',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({ student: studentsRepository.items[0] });
	});

	it('should hash password upon registration', async () => {
		const password = '123@test';

		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password,
		});

		const hashedPassword = await hasher.hash(password);

		expect(result.isRight()).toBe(true);
		expect(studentsRepository.items[0].password).toBe(hashedPassword);
	});
});
