import { Question } from '../../enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/QuestionsRepository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = {
  question: Question[]
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const question = await this.questionsRepository.findManyRecent({ page })

    if (!question) {
      throw new Error('Questions not found')
    }

    return {
      question,
    }
  }
}
