import '../../data/models/post_model.dart';

/// Clean domain entity for Post
typedef PostEntity = PostModel;

class LikeResult {
  final bool isLiked;
  final int likesCount;

  const LikeResult({required this.isLiked, required this.likesCount});
}
