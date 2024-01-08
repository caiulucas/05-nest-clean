import { z } from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
	PAGE_SIZE: z.coerce.number().default(20),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
