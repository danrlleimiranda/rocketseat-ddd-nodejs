import { Answer } from '../../enterprise/entities/Answer'
import { AnswersRepository } from '../repositories/AnswersRepository'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  title: string
  content: string
}

type EditAnswerUseCaseResponse = {
  answer: Answer
}
export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    answer.content = content
    await this.answersRepository.save(answer)

    return {
      answer,
    }
  }
}
