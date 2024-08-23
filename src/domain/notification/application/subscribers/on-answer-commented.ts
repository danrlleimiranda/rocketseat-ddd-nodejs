import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/AnswerCommentsRepository'
import { AnswerCommentedEvent } from '@/domain/forum/enterprise/events/answer-commented-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCommented implements EventHandler {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
    private sendNotificaton: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentedEvent) {
    const answerCommented = await this.answerCommentsRepository.findById(
      answerComment.id.toString(),
    )

    if (answerCommented) {
      await this.sendNotificaton.execute({
        recipientId: answerCommented?.authorId.toString(),
        title: `Um comentário foi adicionado na sua resposta:  "${answerComment.content
          .substring(0, 20)
          .concat('...')}"`,
        content: answerComment.excerpt,
      })
    }
  }
}
