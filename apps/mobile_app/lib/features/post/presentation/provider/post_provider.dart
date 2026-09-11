import 'package:flutter/material.dart';
import '../../data/models/post_model.dart';
import '../../domain/repositories/post_repository.dart';

class PostProvider with ChangeNotifier {
  final PostRepository _postRepository;

  PostProvider({required PostRepository postRepository}) : _postRepository = postRepository;

  List<PostModel> _feed = [];
  bool _isLoading = false;
  String? _error;

  List<PostModel> get feed => _feed;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchFeed({bool refresh = false}) async {
    if (_isLoading) return;
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final posts = await _postRepository.getHomeFeed(limit: 20, offset: refresh ? 0 : _feed.length);
      if (refresh) {
        _feed = posts;
      } else {
        _feed.addAll(posts);
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleLike(String postId) async {
    final index = _feed.indexWhere((p) => p.id == postId);
    if (index == -1) return;

    final currentPost = _feed[index];
    final wasLiked = currentPost.isLiked;
    final newLikesCount = wasLiked ? currentPost.likesCount - 1 : currentPost.likesCount + 1;

    // Optimistic update
    _feed[index] = currentPost.copyWith(
      isLiked: !wasLiked,
      likesCount: newLikesCount >= 0 ? newLikesCount : 0,
    );
    notifyListeners();

    try {
      final result = await _postRepository.toggleLike(postId);
      _feed[index] = _feed[index].copyWith(
        isLiked: result.isLiked,
        likesCount: result.likesCount,
      );
      notifyListeners();
    } catch (e) {
      // Revert on error
      _feed[index] = currentPost;
      notifyListeners();
    }
  }

  Future<bool> deletePost(String postId) async {
    final success = await _postRepository.deletePost(postId);
    if (success) {
      _feed.removeWhere((p) => p.id == postId);
      notifyListeners();
    }
    return success;
  }
}
