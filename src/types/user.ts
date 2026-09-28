export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  isFixed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}
