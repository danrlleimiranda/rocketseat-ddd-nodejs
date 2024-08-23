import { Notification } from '../../enterprise/entities/Notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<Notification>
  findById(id: string): Promise<Notification | null>
  save(notification: Notification): Promise<void>
}
