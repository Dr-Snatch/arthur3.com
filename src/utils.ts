export function getTags(tagString: string | undefined, limit = 3): string[] {
	return tagString ? tagString.split(',').map((tag) => tag.trim()).slice(0, limit) : [];
}
