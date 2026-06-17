import '../entities/user_entity.dart';

/// Abstract contract for auth data operations.
///
/// The concrete implementation lives in
/// [AuthRepositoryImpl] (data layer).
/// This interface keeps the domain layer framework-free.
abstract class AuthRepository {
  /// Sign in with email and password.
  /// Returns the authenticated [UserEntity] on success.
  Future<UserEntity> signIn({
    required String email,
    required String password,
  });

  /// Create a new account with email, password, and optional display name.
  Future<UserEntity> signUp({
    required String email,
    required String password,
    String? name,
  });

  /// Sign out the current user and revoke tokens.
  Future<void> signOut();

  /// Fetch the currently authenticated user from the server.
  /// Throws if no valid session exists.
  Future<UserEntity> getCurrentUser();

  /// Returns true if a valid access token exists in secure storage.
  Future<bool> hasValidSession();
}
