import type { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
	constructor(private readonly jwtService: JwtService) {}

	async encrypt(payload: Record<string, unknown>) {
		return this.jwtService.signAsync(payload);
	}
}
