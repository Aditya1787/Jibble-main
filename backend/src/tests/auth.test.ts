/**
 * @file auth.test.ts
 * @description Unit tests for auth module core flows.
 *              Tests authService methods by mocking their repository and utility
 *              dependencies — no real DB or JWT secret is needed.
 *
 * Run: npm test -- --testPathPattern=auth
 */

// ── Jest module mocks (must be before imports) ────────────────────────────────

jest.mock('../modules/user/user.repository');
jest.mock('../modules/auth/auth.repository');
jest.mock('../modules/user/user.mapper');
jest.mock('../utils/crypto');

import { authService } from '../modules/auth/auth.service';
import { userRepository } from '../modules/user/user.repository';
import { authRepository } from '../modules/auth/auth.repository';
import { userMapper } from '../modules/user/user.mapper';
import * as crypto from '../utils/crypto';
import { AppError } from '../middlewares/error.middleware';

// ── Typed mocks ───────────────────────────────────────────────────────────────

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;
const mockAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockUserMapper = userMapper as jest.Mocked<typeof userMapper>;
const mockCrypto = crypto as jest.Mocked<typeof crypto>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_USER_ROW = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  phone: null,
  password_hash: '$2a$12$hashedpassword',
  provider: 'local',
  provider_id: null,
  status: 'active',
  email_verified: true,
  phone_verified: false,
  last_login_at: null,
  refresh_token: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const MOCK_USER_DTO = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  phone: null,
  provider: 'local',
  status: 'active',
  emailVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const MOCK_TOKENS = {
  accessToken: 'mock.access.token',
  refreshToken: 'mock.refresh.token',
  expiresIn: 900,
};

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();

  // Default: crypto helpers work
  mockCrypto.hashPassword.mockResolvedValue('$2a$12$hashedpassword');
  mockCrypto.comparePassword.mockResolvedValue(true);
  mockCrypto.signAccessToken.mockReturnValue('mock.access.token');
  mockCrypto.signRefreshToken.mockReturnValue('mock.refresh.token');
  mockCrypto.hashToken.mockResolvedValue('hashed.refresh.token');
  mockCrypto.compareToken.mockResolvedValue(true);
  mockCrypto.verifyRefreshToken.mockReturnValue({
    sub: 'user-uuid-1',
    email: 'test@example.com',
    type: 'refresh',
  });

  // Default: mapper works
  mockUserMapper.toDto.mockReturnValue(MOCK_USER_DTO as any);

  // Default: auth repository stubs
  mockAuthRepo.storeRefreshToken.mockResolvedValue(undefined);
  mockAuthRepo.markEmailVerified.mockResolvedValue(undefined);
  mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
  mockAuthRepo.verifyRefreshToken.mockResolvedValue(true);
  mockAuthRepo.revokeRefreshToken.mockResolvedValue(undefined);
});

// ── signup ────────────────────────────────────────────────────────────────────

describe('authService.signup', () => {
  it('creates a new user and returns tokens on success', async () => {
    mockUserRepo.emailExists.mockResolvedValue(false);
    mockUserRepo.create.mockResolvedValue(MOCK_USER_ROW as any);
    mockUserRepo.findById.mockResolvedValue(MOCK_USER_ROW as any);

    const result = await authService.signup({
      email: 'test@example.com',
      password: 'Password1',
    });

    expect(mockUserRepo.emailExists).toHaveBeenCalledWith('test@example.com');
    expect(mockCrypto.hashPassword).toHaveBeenCalledWith('Password1');
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com', provider: 'local' }),
    );
    expect(mockAuthRepo.markEmailVerified).toHaveBeenCalledWith('user-uuid-1');
    expect(mockAuthRepo.updateLastLogin).toHaveBeenCalledWith('user-uuid-1');
    expect(result.tokens.accessToken).toBe('mock.access.token');
    expect(result.tokens.refreshToken).toBe('mock.refresh.token');
    expect(result.user).toEqual(MOCK_USER_DTO);
  });

  it('throws CONFLICT if email is already taken', async () => {
    mockUserRepo.emailExists.mockResolvedValue(true);

    await expect(
      authService.signup({ email: 'taken@example.com', password: 'Password1' }),
    ).rejects.toMatchObject({
      code: 'EMAIL_TAKEN',
      statusCode: 409,
    });

    expect(mockUserRepo.create).not.toHaveBeenCalled();
  });
});

// ── login ─────────────────────────────────────────────────────────────────────

describe('authService.login', () => {
  it('returns tokens on valid credentials', async () => {
    mockAuthRepo.findByEmail.mockResolvedValue(MOCK_USER_ROW as any);
    mockCrypto.comparePassword.mockResolvedValue(true);
    mockUserRepo.findById.mockResolvedValue(MOCK_USER_ROW as any);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'Password1',
    });

    expect(mockAuthRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockCrypto.comparePassword).toHaveBeenCalledWith(
      'Password1',
      MOCK_USER_ROW.password_hash,
    );
    expect(result.tokens.accessToken).toBe('mock.access.token');
    expect(result.user).toEqual(MOCK_USER_DTO);
  });

  it('throws UNAUTHORIZED if user does not exist', async () => {
    mockAuthRepo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'noone@example.com', password: 'Password1' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws UNAUTHORIZED if password is wrong', async () => {
    mockAuthRepo.findByEmail.mockResolvedValue(MOCK_USER_ROW as any);
    mockCrypto.comparePassword.mockResolvedValue(false);

    await expect(
      authService.login({ email: 'test@example.com', password: 'WrongPass1' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws FORBIDDEN if account is banned', async () => {
    mockAuthRepo.findByEmail.mockResolvedValue({
      ...MOCK_USER_ROW,
      status: 'banned',
    } as any);
    mockCrypto.comparePassword.mockResolvedValue(true);

    await expect(
      authService.login({ email: 'test@example.com', password: 'Password1' }),
    ).rejects.toMatchObject({ statusCode: 403, code: 'ACCOUNT_BANNED' });
  });

  it('throws BAD_REQUEST if account uses social login (no password_hash)', async () => {
    mockAuthRepo.findByEmail.mockResolvedValue({
      ...MOCK_USER_ROW,
      password_hash: null,
      provider: 'google',
    } as any);

    await expect(
      authService.login({ email: 'test@example.com', password: 'Password1' }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'SOCIAL_LOGIN_REQUIRED',
    });
  });
});

// ── refreshTokens ─────────────────────────────────────────────────────────────

describe('authService.refreshTokens', () => {
  it('returns new tokens on a valid refresh token', async () => {
    mockUserRepo.findById.mockResolvedValue(MOCK_USER_ROW as any);
    mockAuthRepo.verifyRefreshToken.mockResolvedValue(true);

    const tokens = await authService.refreshTokens('valid.refresh.token');

    expect(mockCrypto.verifyRefreshToken).toHaveBeenCalledWith('valid.refresh.token');
    expect(mockAuthRepo.verifyRefreshToken).toHaveBeenCalledWith(
      'user-uuid-1',
      'valid.refresh.token',
    );
    expect(tokens.accessToken).toBe('mock.access.token');
    expect(tokens.refreshToken).toBe('mock.refresh.token');
  });

  it('throws UNAUTHORIZED if refresh token is revoked (not in DB)', async () => {
    mockAuthRepo.verifyRefreshToken.mockResolvedValue(false);

    await expect(
      authService.refreshTokens('revoked.refresh.token'),
    ).rejects.toMatchObject({ statusCode: 401, code: 'TOKEN_REVOKED' });
  });

  it('throws UNAUTHORIZED if refresh token is invalid/expired (JWT error)', async () => {
    mockCrypto.verifyRefreshToken.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await expect(
      authService.refreshTokens('expired.token'),
    ).rejects.toMatchObject({ statusCode: 401, code: 'TOKEN_INVALID' });
  });

  it('throws UNAUTHORIZED if token type is not refresh', async () => {
    mockCrypto.verifyRefreshToken.mockReturnValue({
      sub: 'user-uuid-1',
      email: 'test@example.com',
      type: 'access', // wrong type
    } as any);

    await expect(
      authService.refreshTokens('access.token.used.as.refresh'),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

// ── logout ────────────────────────────────────────────────────────────────────

describe('authService.logout', () => {
  it('revokes the refresh token on logout', async () => {
    await authService.logout('user-uuid-1');

    expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledWith('user-uuid-1');
  });
});

// ── getMe ─────────────────────────────────────────────────────────────────────

describe('authService.getMe', () => {
  it('returns the mapped user DTO for a valid user ID', async () => {
    mockUserRepo.findById.mockResolvedValue(MOCK_USER_ROW as any);

    const result = await authService.getMe('user-uuid-1');

    expect(mockUserRepo.findById).toHaveBeenCalledWith('user-uuid-1');
    expect(result).toEqual(MOCK_USER_DTO);
  });

  it('throws NOT_FOUND if user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(authService.getMe('nonexistent-id')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
