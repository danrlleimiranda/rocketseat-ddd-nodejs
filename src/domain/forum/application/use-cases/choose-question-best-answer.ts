import { Either, left, right } from '@/core/Either'
import { Question } from '../../enterprise/entities/Question'
import { AnswersRepository } from '../repositories/AnswersRepository'
import { QuestionsRepository } from '../repositories/QuestionsRepository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }
    if (authorId !== answer.authorId.toString()) {
      left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id
    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
