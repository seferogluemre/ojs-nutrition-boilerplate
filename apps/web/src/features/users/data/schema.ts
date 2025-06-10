export type UserStatus = "active" | "inactive" | "invited" | "suspended";

export type UserRole = "superadmin" | "admin" | "cashier" | "manager";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserList = User[];
