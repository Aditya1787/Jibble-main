import '../../../post/data/datasources/post_service.dart';
import '../../../post/data/models/post_model.dart';
import '../../domain/repositories/home_repository.dart';

class HomeRepositoryImpl implements HomeRepository {
  final PostService _postService;

  HomeRepositoryImpl({required PostService postService}) : _postService = postService;

  @override
  Future<List<PostModel>> getHomeFeed({int limit = 20, int offset = 0}) {
    return _postService.getHomeFeed(limit: limit, offset: offset);
  }

  @override
  Future<List<PostModel>> getCategoryFeed(String category, {int limit = 20, int offset = 0}) {
    return _postService.getHomeFeed(limit: limit, offset: offset);
  }
}
