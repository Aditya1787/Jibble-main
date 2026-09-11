import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/profile_model.dart';

class ProfileService {
  final ApiClient _client;

  ProfileService({required ApiClient client}) : _client = client;

  Future<ProfileModel> getMyProfile() async {
    final response = await _client.dio.get(Endpoints.profileMe);
    return ProfileModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<ProfileModel> getProfileByUsername(String username) async {
    final response = await _client.dio.get(Endpoints.profileByUsername(username));
    return ProfileModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<bool> checkUsernameAvailable(String username) async {
    final response = await _client.dio.get(Endpoints.profileUsernameCheck(username));
    return response.data['data']['available'] as bool? ?? false;
  }

  Future<ProfileModel> updateProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
    String? bannerUrl,
  }) async {
    final response = await _client.dio.patch(
      Endpoints.profileMe,
      data: {
        if (displayName != null) 'displayName': displayName,
        if (bio != null) 'bio': bio,
        if (avatarUrl != null) 'avatarUrl': avatarUrl,
        if (bannerUrl != null) 'bannerUrl': bannerUrl,
      },
    );
    return ProfileModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}
