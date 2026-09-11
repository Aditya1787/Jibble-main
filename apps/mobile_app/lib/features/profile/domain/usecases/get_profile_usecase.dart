import '../../data/models/profile_model.dart';
import '../repositories/profile_repository.dart';

class GetProfileUseCase {
  final ProfileRepository _repository;

  GetProfileUseCase(this._repository);

  Future<ProfileModel> call(String username) {
    if (username.isEmpty || username == 'me') {
      return _repository.getMyProfile();
    }
    return _repository.getProfileByUsername(username);
  }
}
