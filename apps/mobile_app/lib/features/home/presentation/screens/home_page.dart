import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../provider/feed_provider.dart';
import '../widgets/stories_row.dart';
import '../widgets/category_chips_row.dart';
import '../widgets/feed_post_card.dart';
import '../widgets/home_drawer.dart';

/// HomePage rendering Neumorphic Top Bar, Stories, Category filters, and Jibble feed posts.
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
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        toolbarHeight: 64,
        leading: Builder(
          builder: (context) => Padding(
            padding: const EdgeInsets.only(left: 14),
            child: GestureDetector(
              onTap: () => Scaffold.of(context).openDrawer(),
              child: const Center(
                child: NeumorphicBox(
                  shape: BoxShape.circle,
                  padding: EdgeInsets.all(10),
                  child: Icon(Icons.menu_rounded, color: AppColors.textPrimary, size: 20),
                ),
              ),
            ),
          ),
        ),
        title: const Text(
          'Jibble',
          style: TextStyle(
            fontFamily: 'Dancing_Script',
            fontSize: 34,
            fontWeight: FontWeight.w800,
            color: AppColors.accent,
            letterSpacing: 1.0,
          ),
        ),
        actions: [
          // Neumorphic Search Button
          GestureDetector(
            onTap: () {},
            child: const NeumorphicBox(
              shape: BoxShape.circle,
              padding: EdgeInsets.all(10),
              child: Icon(Icons.search_rounded, color: AppColors.textPrimary, size: 20),
            ),
          ),
          const SizedBox(width: 10),

          // Neumorphic Notification Button with Badge Dot
          GestureDetector(
            onTap: () {},
            child: Stack(
              children: [
                const NeumorphicBox(
                  shape: BoxShape.circle,
                  padding: EdgeInsets.all(10),
                  child: Icon(Icons.notifications_none_rounded, color: AppColors.textPrimary, size: 20),
                ),
                Positioned(
                  top: 2,
                  right: 2,
                  child: Container(
                    width: 9,
                    height: 9,
                    decoration: const BoxDecoration(
                      color: AppColors.accent,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),
        ],
      ),
      body: _buildBody(feedState),
    );
  }

  Widget _buildBody(FeedState state) {
    if (state.status == FeedStatus.loading && state.posts.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.accent),
      );
    }

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

    return RefreshIndicator(
      onRefresh: () => ref.read(feedProvider.notifier).loadFeed(),
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.only(top: 8, bottom: 24),
        itemCount: state.posts.length + 3,
        itemBuilder: (context, index) {
          if (index == 0) {
            // Stories Section
            return const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: StoriesRow(),
            );
          }

          if (index == 1) {
            // Category Chips Row
            return const Padding(
              padding: EdgeInsets.only(bottom: 14),
              child: CategoryChipsRow(),
            );
          }

          final postIndex = index - 2;

          if (postIndex < state.posts.length) {
            final post = state.posts[postIndex];
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
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
