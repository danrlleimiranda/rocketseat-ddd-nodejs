import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../entities/Answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
