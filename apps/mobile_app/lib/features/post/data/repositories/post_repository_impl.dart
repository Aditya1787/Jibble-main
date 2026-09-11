import '../../domain/entities/post_entity.dart';
import '../../domain/repositories/post_repository.dart';
import '../datasources/post_service.dart';
import '../models/post_model.dart';

class PostRepositoryImpl implements PostRepository {
  final PostService _postService;

  PostRepositoryImpl({required PostService postService}) : _postService = postService;

  @override
  Future<List<PostModel>> getHomeFeed({int limit = 20, int offset = 0}) {
    return _postService.getHomeFeed(limit: limit, offset: offset);
  }

  @override
  Future<PostModel> getPostById(String postId) {
    return _postService.getPostById(postId);
  }

  @override
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
  }) {
    return _postService.createPost(
      type: type,
      visibility: visibility,
      caption: caption,
      mediaUrls: mediaUrls,
      thumbnailUrl: thumbnailUrl,
      location: location,
      hashtags: hashtags,
      circleId: circleId,
      targetDestination: targetDestination,
      hideLikesAndViews: hideLikesAndViews,
      hideComments: hideComments,
      isAnonymous: isAnonymous,
      anonymousAlias: anonymousAlias,
    );
  }

  @override
  Future<LikeResult> toggleLike(String postId) {
    return _postService.toggleLike(postId);
  }

  @override
  Future<bool> deletePost(String postId) {
    return _postService.deletePost(postId);
  }

  @override
  Future<List<PostModel>> getUserPosts(String username, {int limit = 20, int offset = 0}) {
    return _postService.getUserPosts(username, limit: limit, offset: offset);
  }

  @override
  Future<bool> reportPost(String postId, String reason) async {
    // Reporting mock / log
    return true;
  }
}
