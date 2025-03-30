import { User } from "./user"

export interface Notification {
  id: number
  sender: {
    id: number
    fullName: string
    avatar: string
  }
  user: User
  message: string
  createdAt: string
  readStatus: boolean
}