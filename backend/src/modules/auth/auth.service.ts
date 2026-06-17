/**
 * @file auth.service.ts
 * @description Core authentication business logic:
 *              signup, login, token refresh, logout, password flows.
 *              Per PRD: JWT + refresh tokens, bcrypt passwords, rate-limited.
 */

import { AppError } from '../../middlewares/error.middleware';
import { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/crypto';
import { userRepository } from '../user/user.repository';
import { userMapper } from '../user/user.mapper';
import { authRepository } from './auth.repository';
import { ACCESS_TOKEN_TTL } from './auth.constants';
import type { SignupInput, LoginInput } from './auth.validation';
import type { AuthResponse, AuthTokens } from './auth.types';

const buildTokens = async (userId: string, email: string): Promise<AuthTokens> => {
  const accessToken = signAccessToken({ sub: userId, email });
  const refreshToken = signRefreshToken({ sub: userId, email });

  // Store hashed refresh token in DB
  await authRepository.storeRefreshToken(userId, refreshToken);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL,
  };
};

export const authService = {
  /**
   * Register a new user.
   * PRD: "Signup with email/phone, password, and OTP verification"
   */
  async signup(dto: SignupInput): Promise<AuthResponse> {
    const exists = await userRepository.emailExists(dto.email);
    if (exists) {
      throw AppError.conflict(
        'An account with this email already exists',
        'EMAIL_TAKEN',
      );
    }

    const passwordHash = await hashPassword(dto.password);

    const userRow = await userRepository.create({
      email: dto.email,
      passwordHash,
      provider: 'local',
    });

    // In a production system, we'd send OTP/verification email here.
    // For now we auto-verify (can add OTP flow later).
    await authRepository.markEmailVerified(userRow.id);

    const freshUser = await userRepository.findById(userRow.id);
    if (!freshUser) throw AppError.internal('Failed to retrieve new user');

    const tokens = await buildTokens(freshUser.id, freshUser.email!);
    await authRepository.updateLastLogin(freshUser.id);

    return {
      user: userMapper.toDto(freshUser) as AuthResponse['user'],
      tokens,
    };
  },

  /**
   * Login with email + password.
   */
  async login(dto: LoginInput): Promise<AuthResponse> {
    const userRow = await authRepository.findByEmail(dto.email);

    if (!userRow) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (!userRow.password_hash) {
      throw AppError.badRequest(
        'This account uses social login. Please sign in with your provider.',
        'SOCIAL_LOGIN_REQUIRED',
      );
    }

    const valid = await comparePassword(dto.password, userRow.password_hash);
    if (!valid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (userRow.status === 'banned') {
      throw AppError.forbidden('Your account has been suspended', 'ACCOUNT_BANNED');
    }

    const tokens = await buildTokens(userRow.id, userRow.email!);
    await authRepository.updateLastLogin(userRow.id);

    const freshUser = await userRepository.findById(userRow.id);
    if (!freshUser) throw AppError.internal('User not found');

    return {
      user: userMapper.toDto(freshUser) as AuthResponse['user'],
      tokens,
    };
  },

  /**
   * Refresh access token using a valid refresh token.
   * PRD: "Refresh token with short-lived access token mechanism"
   */
  async refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token', 'TOKEN_INVALID');
    }

    if (payload.type !== 'refresh') {
      throw AppError.unauthorized('Invalid token type');
    }

    const valid = await authRepository.verifyRefreshToken(payload.sub, rawRefreshToken);
    if (!valid) {
      throw AppError.unauthorized('Refresh token has been revoked', 'TOKEN_REVOKED');
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || user.status === 'banned') {
      throw AppError.unauthorized('Account not found or suspended');
    }

    return buildTokens(user.id, user.email!);
  },

  /**
   * Logout — revoke refresh token.
   * PRD: "Logout on all devices option"
   */
  async logout(userId: string): Promise<void> {
    await authRepository.revokeRefreshToken(userId);
  },

  /**
   * Get the current authenticated user's info.
   */
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return userMapper.toDto(user);
  },
};
