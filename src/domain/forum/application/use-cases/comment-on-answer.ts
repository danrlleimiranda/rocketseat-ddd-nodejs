import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { AnswerComment } from '../../enterprise/entities/AnswerComment'
import { AnswerCommentsRepository } from '../repositories/AnswerCommentsRepository'
import { AnswersRepository } from '../repositories/AnswersRepository'
interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = {
  answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not Found.')
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })
    await this.answerCommentsRepository.create(answerComment)

    return {
      answerComment,
    }
  }
}
