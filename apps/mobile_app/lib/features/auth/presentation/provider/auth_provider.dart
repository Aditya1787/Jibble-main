import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/network/api_client.dart';
import '../../data/datasources/auth_service.dart';
import '../../data/models/user_model.dart';

// ── Infrastructure providers ──────────────────────────────────────────────────

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (_) => const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  ),
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

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
  });

  factory AuthState.initial() =>
      const AuthState(status: AuthStatus.initial);
  factory AuthState.unauthenticated() =>
      const AuthState(status: AuthStatus.unauthenticated);
  factory AuthState.authenticated(UserModel user) =>
      AuthState(status: AuthStatus.authenticated, user: user);
  factory AuthState.loading() =>
      const AuthState(status: AuthStatus.loading);
  factory AuthState.error(String msg) =>
      AuthState(status: AuthStatus.error, errorMessage: msg);

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
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

  /// Called on startup — tries to restore session from secure storage.
  Future<void> checkAuth() async {
    print('DEBUG: [checkAuth] started');
    state = AuthState.loading();
    try {
      print('DEBUG: [checkAuth] reading access_token from storage...');
      final token = await _storage.read(key: 'access_token');
      print('DEBUG: [checkAuth] access_token read complete. token: $token');
      if (token == null) {
        print('DEBUG: [checkAuth] token is null. Waiting 2 seconds for splash design...');
        await Future.delayed(const Duration(seconds: 2));
        print('DEBUG: [checkAuth] transitioning to unauthenticated.');
        state = AuthState.unauthenticated();
        return;
      }
      // Token exists — fetch current user to validate it
      print('DEBUG: [checkAuth] token exists. fetching current user...');
      final user = await _authService.getMe();
      print('DEBUG: [checkAuth] current user fetched. authenticated as: ${user.email}');
      state = AuthState.authenticated(user);
    } catch (e) {
      print('DEBUG: [checkAuth] error occurred: $e');
      print('DEBUG: [checkAuth] Waiting 2 seconds for splash design...');
      await Future.delayed(const Duration(seconds: 2));
      // Token invalid or expired — clear it and go unauthenticated
      print('DEBUG: [checkAuth] deleting stored tokens due to error.');
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
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
      final user = UserModel.fromJson(res['user'] as Map<String, dynamic>);
      state = AuthState.authenticated(user);
    } catch (e) {
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
      final user = UserModel.fromJson(res['user'] as Map<String, dynamic>);
      state = AuthState.authenticated(user);
    } catch (e) {
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
