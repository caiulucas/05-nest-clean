import type { Comment } from '@/domain/forum/enterprise/entities/comment';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function commentPresenterToHttp(comment: Comment<any>) {
	return {
		id: comment.id.toValue(),
		content: comment.content,
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
	};
}
