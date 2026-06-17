import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/user_model.dart';

/// Low-level HTTP calls to the /auth backend endpoints.
///
/// This datasource talks directly to the API and returns raw maps/models.
/// Business logic (token storage, error handling) lives in [AuthNotifier].
class AuthService {
  final ApiClient _apiClient;

  AuthService(this._apiClient);

  // ── Login ─────────────────────────────────────────────────────────────────

  /// POST /api/v1/auth/login
  /// Returns the raw data map: { user, accessToken, refreshToken?, expiresIn }
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiClient.dio.post(
      Endpoints.authLogin,
      data: {'email': email, 'password': password},
    );
    return response.data['data'] as Map<String, dynamic>;
  }

  // ── Signup ────────────────────────────────────────────────────────────────

  /// POST /api/v1/auth/signup
  Future<Map<String, dynamic>> signup(
    String email,
    String password,
    String name,
  ) async {
    final response = await _apiClient.dio.post(
      Endpoints.authSignup,
      data: {
        'email': email,
        'password': password,
        if (name.isNotEmpty) 'name': name,
      },
    );
    return response.data['data'] as Map<String, dynamic>;
  }

  // ── Get current user ─────────────────────────────────────────────────────

  /// GET /api/v1/auth/me — token is injected by [NetworkInterceptor].
  Future<UserModel> getMe() async {
    final response = await _apiClient.dio.get(Endpoints.authMe);
    final data = response.data['data'] as Map<String, dynamic>;
    return UserModel.fromJson(data['user'] as Map<String, dynamic>);
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  /// POST /api/v1/auth/logout
  Future<void> logout() async {
    try {
      await _apiClient.dio.post(Endpoints.authLogout);
    } on DioException catch (_) {
      // Network error during logout — swallow; caller clears tokens anyway
    }
  }

  // ── Refresh ───────────────────────────────────────────────────────────────

  /// POST /api/v1/auth/refresh
  /// Returns new access token. Token refresh is also handled silently
  /// by [NetworkInterceptor] on 401s — this method is for explicit refresh.
  Future<String?> refresh(String refreshToken) async {
    try {
      final response = await _apiClient.dio.post(
        Endpoints.authRefresh,
        data: {'refreshToken': refreshToken},
      );
      final data = response.data['data'] as Map<String, dynamic>;
      return data['accessToken'] as String?;
    } catch (_) {
      return null;
    }
  }
}
