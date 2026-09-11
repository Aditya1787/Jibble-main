import '../../data/models/profile_model.dart';

abstract class ProfileRepository {
  Future<ProfileModel> getMyProfile();
  Future<ProfileModel> getProfileByUsername(String username);
  Future<bool> isUsernameAvailable(String username);
  Future<ProfileModel> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
    String? bannerUrl,
  });
  Future<String> uploadProfilePicture(String filePath);
}
