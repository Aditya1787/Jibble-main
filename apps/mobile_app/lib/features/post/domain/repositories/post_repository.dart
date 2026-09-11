import '../../data/models/post_model.dart';
import '../entities/post_entity.dart';

abstract class PostRepository {
  Future<List<PostModel>> getHomeFeed({int limit = 20, int offset = 0});
  Future<PostModel> getPostById(String postId);
  Future<PostModel> createPost({
    required String type,
    required String visibility,
    String? caption,
    List<String>? mediaUrls,
    String? thumbnailUrl,
    String? location,
    List<String>? hashtags,
    String? circleId,
    String targetDestination = 'global_feed',
    bool hideLikesAndViews = false,
    bool hideComments = false,
    bool isAnonymous = false,
    String? anonymousAlias,
  });
  Future<LikeResult> toggleLike(String postId);
  Future<bool> deletePost(String postId);
  Future<List<PostModel>> getUserPosts(String username, {int limit = 20, int offset = 0});
  Future<bool> reportPost(String postId, String reason);
}
