import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../provider/feed_provider.dart';
import '../widgets/stories_row.dart';
import '../widgets/category_chips_row.dart';
import '../widgets/feed_post_card.dart';
import '../widgets/home_drawer.dart';

/// HomePage rendering Stories, Category filters, and Jibble posts with pagination.
class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    // If we scroll past 90% of the maximum scroll extent, fetch next page
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent * 0.9) {
      ref.read(feedProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final feedState = ref.watch(feedProvider);

    return Scaffold(
      drawer: const HomeDrawer(),
      appBar: AppBar(
        title: const Text(
          'Jibble',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            letterSpacing: 0.5,
            color: AppColors.accent,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, size: 26),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.search_rounded, size: 26),
            onPressed: () {},
          ),
        ],
      ),
      body: _buildBody(feedState),
    );
  }

  Widget _buildBody(FeedState state) {
    // 1. Initial Loading State
    if (state.status == FeedStatus.loading && state.posts.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.accent),
      );
    }

    // 2. Initial Error State
    if (state.status == FeedStatus.error && state.posts.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline_rounded, size: 54, color: AppColors.danger),
              const SizedBox(height: 16),
              Text(
                state.errorMessage ?? 'An error occurred',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => ref.read(feedProvider.notifier).loadFeed(),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(140, 44),
                  backgroundColor: AppColors.surface,
                  side: const BorderSide(color: AppColors.border),
                ),
                child: const Text('Retry', style: TextStyle(color: AppColors.textPrimary)),
              ),
            ],
          ),
        ),
      );
    }

    // 3. Post Feed Content
    return RefreshIndicator(
      onRefresh: () => ref.read(feedProvider.notifier).loadFeed(),
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.only(top: 16, bottom: 24),
        itemCount: state.posts.length + 3, // Stories (1) + Categories (2) + Posts + Loader (last)
        itemBuilder: (context, index) {
          if (index == 0) {
            // Stories Header Widget
            return const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: StoriesRow(),
            );
          }

          if (index == 1) {
            // Category scrollbar
            return const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: CategoryChipsRow(),
            );
          }

          // Fetch post offset index
          final postIndex = index - 2;

          if (postIndex < state.posts.length) {
            final post = state.posts[postIndex];
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: FeedPostCard(
                post: post,
                onLikeTapped: () {
                  ref.read(feedProvider.notifier).toggleLike(post.id);
                },
              ),
            );
          }

          // Loader widget at the very bottom
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Center(
              child: state.hasMore
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: AppColors.accent,
                      ),
                    )
                  : const Text(
                      "You're all caught up! 🎉",
                      style: TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          );
        },
      ),
    );
  }
}
