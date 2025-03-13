import type { ComponentType } from "react"

export type UserRole = "ROLE_ADMIN" | "ROLE_STAFF" | "ROLE_CUSTOMER"

export interface MenuItem {
  key: string
  label: string
  icon: ComponentType<{ className?: string }>
  path?: string
  onClick?: () => void
  subItems?: MenuItem[]
  roles?: UserRole[]
}

