import { Either, left, right } from '@/core/Either'
import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/Question'
import { QuestionAttachment } from '../../enterprise/entities/QuestionAttachment'
import { QuestionAttachmentList } from '../../enterprise/entities/QuestionAttachmentList'
import { QuestionAttachmentsRepository } from '../repositories/QuestionAttachmentsRepository'
import { QuestionsRepository } from '../repositories/QuestionsRepository'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
    title,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )
    const questionAttachments = attachmentsIds.map((id) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      }),
    )

    questionAttachmentList.update(questionAttachments)
    question.title = title
    question.content = content
    question.attachments = questionAttachmentList
    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
