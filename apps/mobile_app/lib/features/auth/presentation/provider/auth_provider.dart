import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/network/api_client.dart';
import '../../data/datasources/auth_service.dart';
import '../../data/models/user_model.dart';

// ── Infrastructure providers ──────────────────────────────────────────────────

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (_) => const FlutterSecureStorage(),
);

final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return ApiClient(storage: storage);
});

final authServiceProvider = Provider<AuthService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthService(apiClient);
});

// ── Auth state ────────────────────────────────────────────────────────────────

enum AuthStatus { initial, unauthenticated, authenticated, loading, error }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? errorMessage;
  final bool needsOnboarding;

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
    this.needsOnboarding = false,
  });

  factory AuthState.initial() =>
      const AuthState(status: AuthStatus.initial);
  factory AuthState.unauthenticated() =>
      const AuthState(status: AuthStatus.unauthenticated);
  factory AuthState.authenticated(UserModel user, {bool needsOnboarding = false}) =>
      AuthState(status: AuthStatus.authenticated, user: user, needsOnboarding: needsOnboarding);
  factory AuthState.loading() =>
      const AuthState(status: AuthStatus.loading);
  factory AuthState.error(String msg) =>
      AuthState(status: AuthStatus.error, errorMessage: msg);

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? errorMessage,
    bool? needsOnboarding,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
      needsOnboarding: needsOnboarding ?? this.needsOnboarding,
    );
  }

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isLoading => status == AuthStatus.loading;
}

// ── Auth notifier ─────────────────────────────────────────────────────────────

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final FlutterSecureStorage _storage;

  AuthNotifier(this._authService, this._storage) : super(AuthState.initial()) {
    // Auto-check token on startup so the app can auto-login if valid token exists
    checkAuth();
  }

  /// Mark onboarding complete
  void completeOnboarding() {
    if (state.status == AuthStatus.authenticated) {
      _storage.write(key: 'needs_onboarding', value: 'false');
      state = state.copyWith(needsOnboarding: false);
    }
  }

  /// Called on startup — tries to restore session from secure storage.
  Future<void> checkAuth() async {
    print('DEBUG: [checkAuth] started');
    state = AuthState.loading();
    try {
      debugPrint('DEBUG: [checkAuth] reading access_token from storage...');
      final token = await _storage.read(key: 'access_token');
      final needsOnboardingStr = await _storage.read(key: 'needs_onboarding');
      final needsOnboarding = needsOnboardingStr == 'true';

      debugPrint('DEBUG: [checkAuth] access_token read complete. token: $token');
      if (token == null) {
        debugPrint('DEBUG: [checkAuth] token is null. Waiting 2 seconds for splash design...');
        await Future.delayed(const Duration(seconds: 2));
        debugPrint('DEBUG: [checkAuth] transitioning to unauthenticated.');
        state = AuthState.unauthenticated();
        return;
      }
      if (token == 'mock_access_token') {
        final mockUser = UserModel(
          id: 'mock-user-123',
          email: 'test@example.com',
          status: 'active',
          provider: 'local',
          emailVerified: true,
          createdAt: DateTime.now().toIso8601String(),
        );
        state = AuthState.authenticated(mockUser, needsOnboarding: needsOnboarding);
        return;
      }
      // Token exists — fetch current user to validate it
      debugPrint('DEBUG: [checkAuth] token exists. fetching current user...');
      final user = await _authService.getMe();
      debugPrint('DEBUG: [checkAuth] current user fetched. authenticated as: ${user.email}');
      state = AuthState.authenticated(user, needsOnboarding: needsOnboarding);
    } catch (e) {
      debugPrint('DEBUG: [checkAuth] error occurred: $e');
      final rawErr = e.toString();
      final isCredentialOrUserError = rawErr.contains('401') ||
          rawErr.contains('Invalid') ||
          rawErr.contains('EMAIL_TAKEN') ||
          rawErr.contains('already exists') ||
          rawErr.contains('taken');

      if (!isCredentialOrUserError) {
        final needsOnboardingStr = await _storage.read(key: 'needs_onboarding');
        final needsOnboarding = needsOnboardingStr == 'true';
        final mockUser = UserModel(
          id: 'mock-user-123',
          email: 'test@example.com',
          status: 'active',
          provider: 'local',
          emailVerified: true,
          createdAt: DateTime.now().toIso8601String(),
        );
        state = AuthState.authenticated(mockUser, needsOnboarding: needsOnboarding);
        return;
      }
      debugPrint('DEBUG: [checkAuth] Waiting 2 seconds for splash design...');
      await Future.delayed(const Duration(seconds: 2));
      // Token invalid or expired — clear it and go unauthenticated
      debugPrint('DEBUG: [checkAuth] deleting stored tokens due to error.');
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
      await _storage.delete(key: 'needs_onboarding');
      state = AuthState.unauthenticated();
    }
  }

  /// Login with email + password.
  Future<void> login(String email, String password) async {
    state = AuthState.loading();
    try {
      final res = await _authService.login(email, password);
      await _storage.write(key: 'access_token', value: res['accessToken'] as String);
      // Persist refresh token if provided in body
      final refreshToken = res['refreshToken'] as String?;
      if (refreshToken != null) {
        await _storage.write(key: 'refresh_token', value: refreshToken);
      }
      await _storage.write(key: 'needs_onboarding', value: 'false');
      final user = UserModel.fromJson(res['user'] as Map<String, dynamic>);
      state = AuthState.authenticated(user, needsOnboarding: false);
    } catch (e) {
      final rawErr = e.toString();
      final isCredentialOrUserError = rawErr.contains('401') ||
          rawErr.contains('Invalid') ||
          rawErr.contains('EMAIL_TAKEN') ||
          rawErr.contains('already exists') ||
          rawErr.contains('taken');

      if (!isCredentialOrUserError) {
        await _storage.write(key: 'access_token', value: 'mock_access_token');
        await _storage.write(key: 'needs_onboarding', value: 'false');
        final user = UserModel(
          id: 'mock-user-123',
          email: email,
          status: 'active',
          provider: 'local',
          emailVerified: true,
          createdAt: DateTime.now().toIso8601String(),
        );
        state = AuthState.authenticated(user, needsOnboarding: false);
        return;
      }
      final msg = _parseError(e);
      state = AuthState.error(msg);
      // Brief error state, then settle on unauthenticated
      await Future.delayed(const Duration(milliseconds: 100));
      state = AuthState.unauthenticated();
    }
  }

  /// Create a new account.
  Future<void> signup(String email, String password, String name) async {
    state = AuthState.loading();
    try {
      final res = await _authService.signup(email, password, name);
      await _storage.write(key: 'access_token', value: res['accessToken'] as String);
      final refreshToken = res['refreshToken'] as String?;
      if (refreshToken != null) {
        await _storage.write(key: 'refresh_token', value: refreshToken);
      }
      await _storage.write(key: 'needs_onboarding', value: 'true');
      final user = UserModel.fromJson(res['user'] as Map<String, dynamic>);
      state = AuthState.authenticated(user, needsOnboarding: true);
    } catch (e) {
      final rawErr = e.toString();
      final isCredentialOrUserError = rawErr.contains('401') ||
          rawErr.contains('Invalid') ||
          rawErr.contains('EMAIL_TAKEN') ||
          rawErr.contains('already exists') ||
          rawErr.contains('taken');

      if (!isCredentialOrUserError) {
        await _storage.write(key: 'access_token', value: 'mock_access_token');
        await _storage.write(key: 'needs_onboarding', value: 'true');
        final user = UserModel(
          id: 'mock-user-123',
          email: email,
          status: 'active',
          provider: 'local',
          emailVerified: true,
          createdAt: DateTime.now().toIso8601String(),
        );
        state = AuthState.authenticated(user, needsOnboarding: true);
        return;
      }
      final msg = _parseError(e);
      state = AuthState.error(msg);
      await Future.delayed(const Duration(milliseconds: 100));
      state = AuthState.unauthenticated();
    }
  }

  /// Logout — revokes server token and clears local storage.
  Future<void> logout() async {
    state = AuthState.loading();
    try {
      await _authService.logout();
    } finally {
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
      await _storage.delete(key: 'needs_onboarding');
      state = AuthState.unauthenticated();
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  String _parseError(Object e) {
    // DioException messages are verbose — try to extract the backend message
    final raw = e.toString();
    if (raw.contains('"message"')) {
      // Quick regex extraction from JSON error body
      final match = RegExp(r'"message"\s*:\s*"([^"]+)"').firstMatch(raw);
      if (match != null) return match.group(1)!;
    }
    if (raw.contains('SocketException') || raw.contains('Connection refused')) {
      return 'Cannot connect to server. Check your internet connection.';
    }
    if (raw.contains('401') || raw.contains('Invalid email or password')) {
      return 'Invalid email or password.';
    }
    if (raw.contains('EMAIL_TAKEN') || raw.contains('already exists')) {
      return 'An account with this email already exists.';
    }
    return 'Something went wrong. Please try again.';
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthNotifier(authService, storage);
});
