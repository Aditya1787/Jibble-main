import '../../data/models/profile_model.dart';
import '../repositories/profile_repository.dart';

class UpdateProfileUseCase {
  final ProfileRepository _repository;

  UpdateProfileUseCase(this._repository);

  Future<ProfileModel> call({
    String? displayName,
    String? bio,
    String? avatarUrl,
    String? bannerUrl,
  }) {
    return _repository.updateProfile(
      displayName: displayName,
      bio: bio,
      avatarUrl: avatarUrl,
      bannerUrl: bannerUrl,
    );
  }
}
