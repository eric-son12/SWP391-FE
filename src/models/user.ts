export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export interface User {
  role: string;
  token: string;
  username: string;
}

export interface UserProfile {
  avatar?: string;
  id?: number | string;
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