export enum ConsultStatus {
  NEW = "NEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface Consult {
  id: number
  parentName: string
  phone: string
  email: string
  childName: string
  childDob: string
  note: string
  status: ConsultStatus
  createdAt: string
}

