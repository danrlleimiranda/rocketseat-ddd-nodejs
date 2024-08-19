import { Either, right } from '@/core/Either'
import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { Question } from '@/domain/forum/enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/QuestionsRepository'
interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    // const questionAttachments = attachmentsIds.map((attachmentId) => {
    //   return QuestionAttachment.create({
    //     attachmentId: new UniqueEntityID(attachmentId),
    //     questionId: question.id,
    //   })
    // })

    // question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
