import { WatchedList } from '@/core/entities/watched-list';
import { QuestionAttachment } from './question-attachment';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
	static create(attachments?: QuestionAttachment[]) {
		return new QuestionAttachmentList(attachments);
	}

	protected compareItems(a: QuestionAttachment, b: QuestionAttachment) {
		return a.equals(b);
	}
}
