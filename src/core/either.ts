export class Left<L, R> {
	readonly value: L;

	private constructor(value: L) {
		this.value = value;
	}

	static create<L, R>(value: L): Either<L, R> {
		return new Left(value);
	}

	isRight(): this is Right<L, R> {
		return false;
	}

	isLeft(): this is Left<L, R> {
		return true;
	}
}

export class Right<L, R> {
	readonly value: R;

	private constructor(value: R) {
		this.value = value;
	}

	static create<L, R>(value: R): Either<L, R> {
		return new Right(value);
	}

	isRight(): this is Right<L, R> {
		return true;
	}

	isLeft(): this is Left<L, R> {
		return false;
	}
}

export type Either<L, R> = Left<L, R> | Right<L, R>;
