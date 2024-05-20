import { Answer } from '@/domain/forum/enterprise/entities/answer';

export function answerPresenterToHttp(answer: Answer) {
	return {
		id: answer.id.toValue(),
		content: answer.content,
		created_at: answer.createdAt,
		updated_at: answer.updatedAt,
	};
}
