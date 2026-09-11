import '../repositories/profile_repository.dart';

class IsUsernameAvailableUseCase {
  final ProfileRepository _repository;

  IsUsernameAvailableUseCase(this._repository);

  Future<bool> call(String username) {
    return _repository.isUsernameAvailable(username);
  }
}
