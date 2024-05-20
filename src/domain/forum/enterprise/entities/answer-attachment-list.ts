import { WatchedList } from '@/core/entities/watched-list';
import type { AnswerAttachment } from './answer-attachment';

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
	static create(attachments?: AnswerAttachment[]) {
		return new AnswerAttachmentList(attachments);
	}

	protected compareItems(a: AnswerAttachment, b: AnswerAttachment) {
		return a.equals(b);
	}
}
