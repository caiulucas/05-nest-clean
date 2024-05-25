import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { beforeEach, describe, expect, it } from 'vitest';

it('should be able to create a new slug from text', () => {
	const slug = Slug.createFromText('An example title');

	expect(slug.value).toBe('an-example-title');
});
