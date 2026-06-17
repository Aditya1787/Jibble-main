/**
 * @file user.types.ts
 * @description User module DTOs and entity shape.
 */

export interface UserDto {
  id: string;
  email: string | null;
  phone: string | null;
  provider: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email?: string;
  phone?: string;
  passwordHash?: string;
  provider?: 'local' | 'google' | 'apple';
  providerId?: string;
  name?: string;
}

export interface UpdateUserDto {
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

/** Full user row from DB */
export interface UserRow {
  id: string;
  email: string | null;
  phone: string | null;
  password_hash: string | null;
  provider: string;
  provider_id: string | null;
  status: string;
  email_verified: boolean;
  phone_verified: boolean;
  last_login_at: string | null;
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
}
