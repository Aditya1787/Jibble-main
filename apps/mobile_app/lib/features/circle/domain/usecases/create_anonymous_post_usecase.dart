import '../entities/anonymous_post_entity.dart';
import '../repositories/circle_repository.dart';

class CreateAnonymousPostUseCase {
  final CircleRepository _repository;

  CreateAnonymousPostUseCase(this._repository);

  Future<AnonymousPostEntity> call(
    String circleId, {
    required String content,
    List<String>? mediaUrls,
  }) {
    return _repository.createAnonymousPost(circleId, content: content, mediaUrls: mediaUrls);
  }
}
