import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../../post/data/models/post_model.dart';

/// Low-level HTTP requests for the Jibble Home Feed endpoints.
class HomeService {
  final ApiClient _apiClient;

  HomeService(this._apiClient);

  /// Fetch the paginated feed list.
  /// GET /api/v1/posts/feed
  Future<List<PostModel>> fetchHomeFeed({
    required int limit,
    required int offset,
  }) async {
    final response = await _apiClient.dio.get(
      Endpoints.postFeed,
      queryParameters: {
        'limit': limit,
        'offset': offset,
      },
    );

    final list = response.data['data'] as List<dynamic>? ?? [];
    return list
        .map((e) => PostModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// Toggle like status for a post.
  /// POST /api/v1/posts/:id/like
  /// Returns a map: { 'isLiked': bool, 'likesCount': int }
  Future<Map<String, dynamic>> toggleLike(String postId) async {
    final response = await _apiClient.dio.post(Endpoints.postLike(postId));
    return response.data['data'] as Map<String, dynamic>;
  }
}
