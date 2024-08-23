import { Either, left, right } from '@/core/Either'
import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Answer } from '../../enterprise/entities/Answer'
import { AnswerAttachment } from '../../enterprise/entities/AnswerAttachment'
import { AnswerAttachmentList } from '../../enterprise/entities/AnswerAttachmentList'
import { AnswerAttachmentsRepository } from '../repositories/AnswerAttachmentsRepository'
import { AnswersRepository } from '../repositories/AnswersRepository'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )
    const answerAttachments = attachmentsIds.map((id) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      }),
    )

    answerAttachmentList.update(answerAttachments)
    answer.attachments = answerAttachmentList
    answer.content = content
    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
