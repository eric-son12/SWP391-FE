export interface Role {
  id: number
  name: string
  description: string
  permissions?: Permission[]
}

export interface Permission {
  module: any
  id: number
  name: string
  description: string
}