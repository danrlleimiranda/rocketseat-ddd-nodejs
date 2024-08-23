import { Either, left, right } from '@/core/Either'
import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { QuestionComment } from '../../enterprise/entities/QuestionComment'
import { QuestionsCommentsRepository } from '../repositories/QuestionCommentsRepository'
import { QuestionsRepository } from '../repositories/QuestionsRepository'
interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionsCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })
    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
