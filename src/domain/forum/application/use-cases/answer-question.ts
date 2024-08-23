import { Either, right } from '@/core/Either'
import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { Answer } from '../../enterprise/entities/Answer'
import { AnswerAttachment } from '../../enterprise/entities/AnswerAttachment'
import { AnswerAttachmentList } from '../../enterprise/entities/AnswerAttachmentList'
import { AnswersRepository } from '../repositories/AnswersRepository'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type AnswerAnswerUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerAnswerUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
