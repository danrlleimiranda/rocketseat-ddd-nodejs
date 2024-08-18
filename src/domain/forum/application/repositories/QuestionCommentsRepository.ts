import { PaginationParams } from '@/core/repositories/PaginationParams'
import { QuestionComment } from '../../enterprise/entities/QuestionComment'

export interface QuestionsCommentsRepository {
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  findById(id: string): Promise<QuestionComment | null>
  save(question: QuestionComment): Promise<void>
  create(question: QuestionComment): Promise<void>
  delete(question: QuestionComment): Promise<void>
}
