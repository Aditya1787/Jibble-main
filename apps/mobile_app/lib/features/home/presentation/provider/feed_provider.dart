import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/provider/auth_provider.dart';
import '../../data/datasources/home_service.dart';
import '../../../post/data/models/post_model.dart';

// Provide HomeService
final homeServiceProvider = Provider<HomeService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return HomeService(apiClient);
});

enum FeedStatus { initial, loading, success, error, loadingMore }

class FeedState {
  final FeedStatus status;
  final List<PostModel> posts;
  final bool hasMore;
  final String selectedCategory;
  final String? errorMessage;

  const FeedState({
    required this.status,
    required this.posts,
    required this.hasMore,
    required this.selectedCategory,
    this.errorMessage,
  });

  factory FeedState.initial() => const FeedState(
        status: FeedStatus.initial,
        posts: [],
        hasMore: true,
        selectedCategory: 'All',
      );

  FeedState copyWith({
    FeedStatus? status,
    List<PostModel>? posts,
    bool? hasMore,
    String? selectedCategory,
    String? errorMessage,
  }) {
    return FeedState(
      status: status ?? this.status,
      posts: posts ?? this.posts,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class FeedNotifier extends StateNotifier<FeedState> {
  final HomeService _homeService;
  static const int _pageSize = 10;

  FeedNotifier(this._homeService) : super(FeedState.initial()) {
    loadFeed();
  }

  /// Initial load of feed (or refresh)
  Future<void> loadFeed() async {
    state = state.copyWith(status: FeedStatus.loading, posts: [], hasMore: true);

    try {
      final posts = await _homeService.fetchHomeFeed(limit: _pageSize, offset: 0);
      
      // Filter locally by category if not 'All'
      final filteredPosts = _filterByCategory(posts, state.selectedCategory);

      state = state.copyWith(
        status: FeedStatus.success,
        posts: filteredPosts,
        hasMore: posts.length >= _pageSize,
      );
    } catch (e) {
      state = state.copyWith(
        status: FeedStatus.error,
        errorMessage: 'Failed to load feed. Please try again.',
      );
    }
  }

  /// Load more items for infinite scroll
  Future<void> loadMore() async {
    if (state.status == FeedStatus.loading ||
        state.status == FeedStatus.loadingMore ||
        !state.hasMore) {
      return;
    }

    state = state.copyWith(status: FeedStatus.loadingMore);

    try {
      // Offset matches current number of posts
      final currentOffset = state.posts.length;
      final posts = await _homeService.fetchHomeFeed(
        limit: _pageSize,
        offset: currentOffset,
      );

      final filteredPosts = _filterByCategory(posts, state.selectedCategory);

      state = state.copyWith(
        status: FeedStatus.success,
        posts: [...state.posts, ...filteredPosts],
        hasMore: posts.length >= _pageSize,
      );
    } catch (_) {
      state = state.copyWith(status: FeedStatus.success); // Keep old posts, revert loading status
    }
  }

  /// Change active filter category and reload feed
  void changeCategory(String category) {
    if (state.selectedCategory == category) return;
    state = state.copyWith(selectedCategory: category);
    loadFeed();
  }

  /// Optimistic update for toggling like status
  Future<void> toggleLike(String postId) async {
    final index = state.posts.indexWhere((p) => p.id == postId);
    if (index == -1) return;

    final post = state.posts[index];
    final originalIsLiked = post.isLiked;
    final originalLikesCount = post.likesCount;

    // 1. Optimistic Update
    final updatedPost = post.copyWith(
      isLiked: !originalIsLiked,
      likesCount: originalIsLiked
          ? (originalLikesCount - 1 > 0 ? originalLikesCount - 1 : 0)
          : originalLikesCount + 1,
    );

    final updatedList = List<PostModel>.from(state.posts);
    updatedList[index] = updatedPost;
    state = state.copyWith(posts: updatedList);

    // 2. Call API
    try {
      final res = await _homeService.toggleLike(postId);
      
      // Confirm with exact server values
      final serverPost = updatedPost.copyWith(
        isLiked: res['isLiked'] as bool,
        likesCount: res['likesCount'] as int,
      );

      final finalResultList = List<PostModel>.from(state.posts);
      // Ensure post is still in list before updating (user might have navigated away/deleted)
      final newIndex = finalResultList.indexWhere((p) => p.id == postId);
      if (newIndex != -1) {
        finalResultList[newIndex] = serverPost;
        state = state.copyWith(posts: finalResultList);
      }
    } catch (_) {
      // 3. Rollback if failed
      final rollbackList = List<PostModel>.from(state.posts);
      final rollbackIndex = rollbackList.indexWhere((p) => p.id == postId);
      if (rollbackIndex != -1) {
        rollbackList[rollbackIndex] = post.copyWith(
          isLiked: originalIsLiked,
          likesCount: originalLikesCount,
        );
        state = state.copyWith(posts: rollbackList);
      }
    }
  }

  List<PostModel> _filterByCategory(List<PostModel> list, String category) {
    if (category == 'All') return list;
    final normalizedCategory = category.toLowerCase();
    
    // In our DB, we store hashtags as TEXT[] and category is matched via tags.
    // If the post has a hashtag matching the category, or caption matches.
    return list.where((p) {
      return p.hashtags.any((t) => t.toLowerCase() == normalizedCategory) ||
             (p.caption?.toLowerCase().contains('#$normalizedCategory') ?? false);
    }).toList();
  }

  /// Add a newly created post optimistically to the top of the feed list
  void addOptimisticPost(PostModel newPost) {
    state = state.copyWith(
      posts: [newPost, ...state.posts],
    );
  }
}

final feedProvider = StateNotifierProvider<FeedNotifier, FeedState>((ref) {
  final homeService = ref.watch(homeServiceProvider);
  return FeedNotifier(homeService);
});
