import '../../data/models/post_model.dart';
import '../repositories/post_repository.dart';

class CreatePostUseCase {
  final PostRepository _repository;

  CreatePostUseCase(this._repository);

  Future<PostModel> call({
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
    return _repository.createPost(
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
}
