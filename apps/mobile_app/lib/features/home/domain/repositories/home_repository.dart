import '../../../post/data/models/post_model.dart';

abstract class HomeRepository {
  Future<List<PostModel>> getHomeFeed({int limit = 20, int offset = 0});
  Future<List<PostModel>> getCategoryFeed(String category, {int limit = 20, int offset = 0});
}
