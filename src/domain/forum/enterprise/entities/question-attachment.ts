import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

export type QuestionAttachmentProps = {
	questionId: UniqueEntityId;
	attachmentId: UniqueEntityId;
};

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
	static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
		return new QuestionAttachment(props, id);
	}

	get questionId() {
		return this.props.questionId;
	}

	get attachmentId() {
		return this.props.attachmentId;
	}
}
