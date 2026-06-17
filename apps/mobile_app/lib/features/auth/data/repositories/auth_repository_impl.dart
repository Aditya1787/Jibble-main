import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/user_model.dart';

/// Repository that wraps all auth API calls and manages token persistence.
///
/// This is the concrete implementation of the auth data source —
/// it talks to the backend and persists tokens in [FlutterSecureStorage].
class AuthRepositoryImpl {
  final ApiClient _apiClient;
  final FlutterSecureStorage _storage;

  AuthRepositoryImpl({
    required ApiClient apiClient,
    required FlutterSecureStorage storage,
  })  : _apiClient = apiClient,
        _storage = storage;

  // ── Login ─────────────────────────────────────────────────────────────────

  /// POST /auth/login
  /// Returns a [UserModel] and persists both tokens in secure storage.
  Future<({UserModel user, String accessToken})> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.dio.post(
      Endpoints.authLogin,
      data: {'email': email, 'password': password},
    );

    final data = response.data['data'] as Map<String, dynamic>;
    final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
    final accessToken = data['accessToken'] as String;

    // Backend stores refresh token in httpOnly cookie; also capture from body
    // for non-browser environments (mobile app uses body).
    final refreshToken = data['refreshToken'] as String?;

    await _persistTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );

    return (user: user, accessToken: accessToken);
  }

  // ── Signup ────────────────────────────────────────────────────────────────

  /// POST /auth/signup
  Future<({UserModel user, String accessToken})> signup({
    required String email,
    required String password,
    String? name,
  }) async {
    final response = await _apiClient.dio.post(
      Endpoints.authSignup,
      data: {
        'email': email,
        'password': password,
        if (name != null && name.isNotEmpty) 'name': name,
      },
    );

    final data = response.data['data'] as Map<String, dynamic>;
    final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String?;

    await _persistTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );

    return (user: user, accessToken: accessToken);
  }

  // ── Get current user ─────────────────────────────────────────────────────

  /// GET /auth/me — requires valid access token in storage.
  Future<UserModel> getMe() async {
    final response = await _apiClient.dio.get(Endpoints.authMe);
    final data = response.data['data'] as Map<String, dynamic>;
    return UserModel.fromJson(data['user'] as Map<String, dynamic>);
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  /// POST /auth/logout — revokes refresh token on server then clears storage.
  Future<void> logout() async {
    try {
      await _apiClient.dio.post(Endpoints.authLogout);
    } on DioException catch (_) {
      // Even if server-side logout fails, clear local tokens
    } finally {
      await _clearTokens();
    }
  }

  // ── Token helpers ─────────────────────────────────────────────────────────

  /// Returns the stored access token, or null if not present.
  Future<String?> getAccessToken() =>
      _storage.read(key: 'access_token');

  /// Returns the stored refresh token, or null if not present.
  Future<String?> getRefreshToken() =>
      _storage.read(key: 'refresh_token');

  Future<void> _persistTokens({
    required String accessToken,
    String? refreshToken,
  }) async {
    await _storage.write(key: 'access_token', value: accessToken);
    if (refreshToken != null) {
      await _storage.write(key: 'refresh_token', value: refreshToken);
    }
  }

  Future<void> _clearTokens() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
  }
}
