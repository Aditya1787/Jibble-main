import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

/// Creates a new user account with email, password, and optional display name.
class SignUpUseCase {
  final AuthRepository _repository;
  const SignUpUseCase(this._repository);

  Future<UserEntity> call({
    required String email,
    required String password,
    String? name,
  }) =>
      _repository.signUp(email: email, password: password, name: name);
}
