import '../entities/story_entity.dart';

abstract class StoryRepository {
  Future<List<StoryEntity>> getStories();
  Future<StoryEntity> createStory({required String mediaUrl, String? caption});
  Future<bool> deleteStory(String storyId);
  Future<void> viewStory(String storyId);
}
