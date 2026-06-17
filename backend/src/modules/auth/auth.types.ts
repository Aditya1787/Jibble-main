/**
 * @file auth.types.ts
 * @description Auth module DTOs and request/response shapes.
 */

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;   // seconds
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    status: string;
    createdAt: string;
  };
  tokens: AuthTokens;
}
