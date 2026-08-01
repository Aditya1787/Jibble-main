import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/story_model.dart';
import '../../../auth/presentation/provider/auth_provider.dart';

enum StoriesStatus { initial, loading, success, error }

class StoriesState {
  final StoriesStatus status;
  final List<UserStoryGroupModel> storyGroups;
  final String? errorMessage;

  const StoriesState({
    required this.status,
    required this.storyGroups,
    this.errorMessage,
  });

  factory StoriesState.initial() => const StoriesState(
        status: StoriesStatus.initial,
        storyGroups: [],
      );

  StoriesState copyWith({
    StoriesStatus? status,
    List<UserStoryGroupModel>? storyGroups,
    String? errorMessage,
  }) {
    return StoriesState(
      status: status ?? this.status,
      storyGroups: storyGroups ?? this.storyGroups,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class StoriesNotifier extends StateNotifier<StoriesState> {
  final Ref _ref;

  StoriesNotifier(this._ref) : super(StoriesState.initial()) {
    loadStories();
  }

  Future<void> loadStories() async {
    state = state.copyWith(status: StoriesStatus.loading);

    try {
      final authState = _ref.read(authProvider);
      final currentUser = authState.user;

      final currentUsername = currentUser?.email.split('@')[0] ?? 'you';
      final currentUserDisplay = currentUsername.toUpperCase();

      // Sample initial story groups with rich media, text, reels & post share support
      final initialGroups = [
        UserStoryGroupModel(
          userId: currentUser?.id ?? 'user-me-123',
          username: currentUsername,
          displayName: currentUserDisplay,
          avatarUrl: null,
          isVerified: true,
          hasUnread: false,
          stories: const [], // Start empty for user, or populated if user posts one
        ),
        UserStoryGroupModel(
          userId: 'friend-1',
          username: 'alex_campus',
          displayName: 'Alex Campus',
          avatarUrl: 'https://i.pravatar.cc/150?img=11',
          isVerified: true,
          hasUnread: true,
          stories: [
            StoryItemModel(
              id: 'story-101',
              userId: 'friend-1',
              type: 'image',
              mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
              textContent: 'Finals prep at campus library! 📚✨',
              musicTitle: '🎵 Chill Lofi Beats',
              location: '📍 Main Campus Library',
              createdAt: DateTime.now().subtract(const Duration(hours: 2)),
            ),
            StoryItemModel(
              id: 'story-102',
              userId: 'friend-1',
              type: 'text',
              textContent: 'Who is free for hackathon ideation tonight? DM me! 🚀',
              createdAt: DateTime.now().subtract(const Duration(hours: 1)),
            ),
          ],
        ),
        UserStoryGroupModel(
          userId: 'friend-2',
          username: 'sophia_dev',
          displayName: 'Sophia Dev',
          avatarUrl: 'https://i.pravatar.cc/150?img=5',
          isVerified: true,
          hasUnread: true,
          stories: [
            StoryItemModel(
              id: 'story-201',
              userId: 'friend-2',
              type: 'reel',
              mediaUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
              textContent: 'Check out our new Jibble Neumorphic design launch! 🔥',
              musicTitle: '🎵 Future Bass Anthems',
              location: '📍 Tech Hub',
              createdAt: DateTime.now().subtract(const Duration(hours: 4)),
            ),
          ],
        ),
        UserStoryGroupModel(
          userId: 'friend-3',
          username: 'marcus_fit',
          displayName: 'Marcus Fit',
          avatarUrl: 'https://i.pravatar.cc/150?img=12',
          isVerified: false,
          hasUnread: true,
          stories: [
            StoryItemModel(
              id: 'story-301',
              userId: 'friend-3',
              type: 'post',
              mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
              textContent: 'Morning workout session at campus gym! 💪',
              location: '📍 Campus Fitness Center',
              createdAt: DateTime.now().subtract(const Duration(hours: 5)),
            ),
          ],
        ),
        UserStoryGroupModel(
          userId: 'friend-4',
          username: 'chloe_art',
          displayName: 'Chloe Art',
          avatarUrl: 'https://i.pravatar.cc/150?img=26',
          isVerified: true,
          hasUnread: false,
          stories: [
            StoryItemModel(
              id: 'story-401',
              userId: 'friend-4',
              type: 'image',
              mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
              textContent: 'Painting workshop submission 🎨✨',
              createdAt: DateTime.now().subtract(const Duration(hours: 8)),
              hasViewed: true,
            ),
          ],
        ),
      ];

      state = state.copyWith(
        status: StoriesStatus.success,
        storyGroups: initialGroups,
      );
    } catch (e) {
      state = state.copyWith(
        status: StoriesStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  /// Post a new story into current user's group
  void addStory(StoryItemModel newStory) {
    final authState = _ref.read(authProvider);
    final currentUser = authState.user;
    final userId = currentUser?.id ?? 'user-me-123';
    final currentUsername = currentUser?.email.split('@')[0] ?? 'you';

    final updatedGroups = List<UserStoryGroupModel>.from(state.storyGroups);
    final userGroupIndex = updatedGroups.indexWhere((g) => g.userId == userId);

    if (userGroupIndex != -1) {
      final userGroup = updatedGroups[userGroupIndex];
      final updatedStories = [newStory, ...userGroup.stories];
      updatedGroups[userGroupIndex] = userGroup.copyWith(
        stories: updatedStories,
        hasUnread: false,
      );
    } else {
      final newGroup = UserStoryGroupModel(
        userId: userId,
        username: currentUsername,
        displayName: currentUsername.toUpperCase(),
        avatarUrl: null,
        isVerified: true,
        hasUnread: false,
        stories: [newStory],
      );
      updatedGroups.insert(0, newGroup);
    }

    state = state.copyWith(storyGroups: updatedGroups);
  }

  /// Mark a story as viewed by user
  void markAsViewed(String storyId) {
    final updatedGroups = state.storyGroups.map((group) {
      final updatedStories = group.stories.map((s) {
        if (s.id == storyId) {
          return s.copyWith(hasViewed: true);
        }
        return s;
      }).toList();

      final hasUnread = updatedStories.any((s) => !s.hasViewed);

      return group.copyWith(
        stories: updatedStories,
        hasUnread: hasUnread,
      );
    }).toList();

    state = state.copyWith(storyGroups: updatedGroups);
  }
}

final storiesProvider = StateNotifierProvider<StoriesNotifier, StoriesState>((ref) {
  return StoriesNotifier(ref);
});
