export class Slug {
	private _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	static create(slug: string) {
		return new Slug(slug);
	}

	/**
	 * Receives a text string and normalize it as a slug.
	 *
	 * @param text {string}
	 *
	 * @example
	 * ```ts
	 * "An example title" => "an-example-title"
	 * ```
	 */
	static createFromText(text: string) {
		const slugText = text
			.normalize('NFKC')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/_/g, '-')
			.replace(/--+/g, '-')
			.replace(/-$/, '');

		return new Slug(slugText);
	}

	get value() {
		return this._value;
	}
}
