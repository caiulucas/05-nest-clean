import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateUniqueDatabaseUrl(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Please provide a DATABASE_URL environment variable');
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set('schema', schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	process.env.DATABASE_URL = generateUniqueDatabaseUrl(schemaId);

	execSync('pnpm prisma migrate deploy');
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});
