import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class bcryptHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return hash(plain, 8);
	}

	async compare(plain: string, hash: string) {
		return compare(plain, hash);
	}
}
