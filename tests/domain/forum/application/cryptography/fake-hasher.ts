import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string) {
		return plain.concat('-hashed');
	}

	async compare(plain: string, hash: string) {
		const isSame = (await this.hash(plain)) === hash;
		return isSame;
	}
}
