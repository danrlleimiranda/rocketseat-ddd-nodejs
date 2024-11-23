import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { DomainEvent } from '@/core/events/domain-event'
import { AnswerComment } from '../entities/AnswerComment'

export class AnswerCommentedEvent implements DomainEvent {
  public occurredAt: Date
  public answerComment: AnswerComment

  constructor(answer: AnswerComment) {
    this.answerComment = answer
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }
}
