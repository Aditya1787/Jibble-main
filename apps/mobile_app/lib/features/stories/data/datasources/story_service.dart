import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../domain/entities/story_entity.dart';

class StoryService {
  final ApiClient _client;

  StoryService({required ApiClient client}) : _client = client;

  Future<List<StoryEntity>> getFeedStories() async {
    final response = await _client.dio.get(Endpoints.storyFeed);
    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => StoryEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<StoryEntity> createStory({required String mediaUrl, String? caption}) async {
    final response = await _client.dio.post(
      Endpoints.stories,
      data: {
        'mediaUrl': mediaUrl,
        if (caption != null) 'caption': caption,
      },
    );
    return StoryEntity.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<bool> deleteStory(String storyId) async {
    final response = await _client.dio.delete('${Endpoints.stories}/$storyId');
    return response.data['success'] as bool? ?? true;
  }

  Future<void> viewStory(String storyId) async {
    await _client.dio.post(Endpoints.viewStory(storyId));
  }
}
