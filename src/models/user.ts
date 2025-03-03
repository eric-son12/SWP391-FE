export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export interface User {
  id: number | string;
  username: string;
  token: string;
  role: UserRole;
}

export interface UserProfile {
  avatar?: string;
  id: number | string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  role: UserRole;
  gender: string;
}

export interface ChildProfile {
  id?: string;
  fullName: string;
  dob: string;
  gender: string;
}

export interface Patient {
  id: number
  username: string
  fullName: string
  dateOfBirth: string
  phone: string
  role: "customer" | "child"
  avatar: string
  vaccineStatus: string
  parent?: Patient
  children?: Patient[]
}