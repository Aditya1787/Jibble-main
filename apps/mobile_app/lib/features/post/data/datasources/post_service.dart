import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../domain/entities/post_entity.dart';
import '../models/post_model.dart';

class PostService {
  final ApiClient _client;

  PostService({required ApiClient client}) : _client = client;

  /// Fetch paginated home feed
  Future<List<PostModel>> getHomeFeed({int limit = 20, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.postFeed,
      queryParameters: {'limit': limit, 'offset': offset},
    );

    final data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => PostModel.fromJson(json as Map<String, dynamic>)).toList();
  }

  /// Fetch single post by ID
  Future<PostModel> getPostById(String postId) async {
    final response = await _client.dio.get(Endpoints.postById(postId));
    return PostModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// Create a new post or circle post with creator privacy controls
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
  }) async {
    final response = await _client.dio.post(
      Endpoints.posts,
      data: {
        'type': type,
        'visibility': visibility,
        'caption': caption,
        'mediaUrls': mediaUrls,
        'thumbnailUrl': thumbnailUrl,
        'location': location,
        'hashtags': hashtags,
        'circleId': circleId,
        'targetDestination': targetDestination,
        'hideLikesAndViews': hideLikesAndViews,
        'hideComments': hideComments,
        'isAnonymous': isAnonymous,
        'anonymousAlias': anonymousAlias,
      },
    );

    return PostModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// Toggle like on a post
  Future<LikeResult> toggleLike(String postId) async {
    final response = await _client.dio.post(Endpoints.postLike(postId));
    final data = response.data['data'] as Map<String, dynamic>;
    return LikeResult(
      isLiked: data['isLiked'] as bool? ?? false,
      likesCount: data['likesCount'] as int? ?? 0,
    );
  }

  /// Delete a post
  Future<bool> deletePost(String postId) async {
    final response = await _client.dio.delete(Endpoints.postById(postId));
    return response.data['success'] as bool? ?? true;
  }

  /// Get posts by user
  Future<List<PostModel>> getUserPosts(String username, {int limit = 20, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.userPosts(username),
      queryParameters: {'limit': limit, 'offset': offset},
    );

    final data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => PostModel.fromJson(json as Map<String, dynamic>)).toList();
  }
}
