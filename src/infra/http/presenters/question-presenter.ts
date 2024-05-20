import { Question } from '@/domain/forum/enterprise/entities/question';

export function questionPresenterToHttp(question: Question) {
	return {
		id: question.id.toValue(),
		best_answer_id: question.bestAnswerId?.toValue(),
		title: question.title,
		slug: question.slug.value,
		created_at: question.createdAt,
		updated_at: question.updatedAt,
	};
}
