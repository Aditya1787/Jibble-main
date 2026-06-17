import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

/// Fetches the currently authenticated user from the server.
///
/// Used on app startup (after a stored token is found) to validate the
/// session and hydrate the [AuthState] with a [UserEntity].
class GetCurrentUserUseCase {
  final AuthRepository _repository;
  const GetCurrentUserUseCase(this._repository);

  Future<UserEntity> call() => _repository.getCurrentUser();
}
