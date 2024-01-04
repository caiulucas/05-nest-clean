import { Either, Left, Right } from '@/core/either';

function doSomething(shouldSuccess: boolean): Either<string, string> {
	if (shouldSuccess) {
		return Right.create('success');
	}

	return Left.create('error');
}

test('success result', () => {
	const success = doSomething(true);

	expect(success.isRight()).toBe(true);
});

test('error result', () => {
	const error = doSomething(false);

	expect(error.isLeft()).toBe(true);
});
