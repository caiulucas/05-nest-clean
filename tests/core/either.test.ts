import { Either, Left, Right } from '@/core/either';
import { expect, it } from 'vitest';

function doSomething(shouldSuccess: boolean): Either<string, string> {
	if (shouldSuccess) {
		return Right.create('success');
	}

	return Left.create('error');
}

it('success result', () => {
	const success = doSomething(true);

	expect(success.isRight()).toBe(true);
});

it('error result', () => {
	const error = doSomething(false);

	expect(error.isLeft()).toBe(true);
});
