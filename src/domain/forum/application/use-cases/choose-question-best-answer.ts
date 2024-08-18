import { Question } from '../../enterprise/entities/Question'
import { AnswersRepository } from '../repositories/AnswersRepository'
import { QuestionsRepository } from '../repositories/QuestionsRepository'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = {
  question: Question
}
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
      throw new Error('Answer not found')
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error('Question not found')
    }
    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    question.bestAnswerId = answer.id
    await this.questionRepository.save(question)

    return {
      question,
    }
  }
}
