import '../repositories/auth_repository.dart';

/// Signs out the current user and revokes their refresh token on the server.
class SignOutUseCase {
  final AuthRepository _repository;
  const SignOutUseCase(this._repository);

  Future<void> call() => _repository.signOut();
}
