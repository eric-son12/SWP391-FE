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
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
}