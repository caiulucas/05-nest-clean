import { z } from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
	PAGE_SIZE: z.coerce.number().default(20),
	CLOUDFLARE_ACCOUNT_ID: z.string(),
	AWS_BUCKET_NAME: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
});

// export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
