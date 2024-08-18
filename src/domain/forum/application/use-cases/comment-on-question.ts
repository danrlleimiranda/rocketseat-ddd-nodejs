import { UniqueEntityID } from '@/core/entities/UniqueEntityId'
import { QuestionComment } from '../../enterprise/entities/QuestionComment'
import { QuestionsCommentsRepository } from '../repositories/QuestionCommentsRepository'
import { QuestionsRepository } from '../repositories/QuestionsRepository'
interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = {
  questionComment: QuestionComment
}

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
      throw new Error('Question not Found.')
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })
    await this.questionCommentsRepository.create(questionComment)

    return {
      questionComment,
    }
  }
}
