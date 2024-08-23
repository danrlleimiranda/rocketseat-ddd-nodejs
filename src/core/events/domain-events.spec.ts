import { vi } from 'vitest'
import { AggregateRoot } from '../entities/AggregateRoot'
import { UniqueEntityID } from '../entities/UniqueEntityId'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  constructor(private aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

    // Estou criando a resposta porém sem salvar no banco
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado.
    expect(callBackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
