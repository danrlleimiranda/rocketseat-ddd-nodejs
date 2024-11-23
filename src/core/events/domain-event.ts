import { UniqueEntityID } from '../entities/UniqueEntityId'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}
