import { PaginationParams } from '@/core/repositories/PaginationParams'
import { AnswerComment } from '../../enterprise/entities/AnswerComment'

export interface AnswerCommentsRepository {
  findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  findById(id: string): Promise<AnswerComment | null>
  save(answer: AnswerComment): Promise<void>
  create(answer: AnswerComment): Promise<void>
  delete(answer: AnswerComment): Promise<void>
}
