export type RoleCode = 'ADMIN' | 'CLIENT_STANDARD' | 'CLIENT_PREMIUM';

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  roleCode: RoleCode;
}
