import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_service.dart';
import '../models/profile_model.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileService _service;

  ProfileRepositoryImpl({required ProfileService service}) : _service = service;

  @override
  Future<ProfileModel> getMyProfile() {
    return _service.getMyProfile();
  }

  @override
  Future<ProfileModel> getProfileByUsername(String username) {
    return _service.getProfileByUsername(username);
  }

  @override
  Future<bool> isUsernameAvailable(String username) {
    return _service.checkUsernameAvailable(username);
  }

  @override
  Future<ProfileModel> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
    String? bannerUrl,
  }) {
    return _service.updateProfile(
      displayName: displayName,
      bio: bio,
      avatarUrl: avatarUrl,
      bannerUrl: bannerUrl,
    );
  }

  @override
  Future<String> uploadProfilePicture(String filePath) async {
    // In production uploads via presigned URL or direct multipart
    return filePath;
  }
}
