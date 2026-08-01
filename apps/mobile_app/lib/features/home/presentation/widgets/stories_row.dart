import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/provider/auth_provider.dart';

/// A horizontal row of user stories, displaying "Your Story" first followed by friend stories.
class StoriesRow extends ConsumerWidget {
  const StoriesRow({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final userInitial = (user?.email != null && user!.email.isNotEmpty)
        ? user.email[0].toUpperCase()
        : 'Y';

    final mockStories = [
      {'name': 'alex_campus', 'avatar': 'https://i.pravatar.cc/150?img=11', 'hasStory': true},
      {'name': 'sophia_dev', 'avatar': 'https://i.pravatar.cc/150?img=5', 'hasStory': true},
      {'name': 'marcus_fit', 'avatar': 'https://i.pravatar.cc/150?img=12', 'hasStory': true},
      {'name': 'emma_design', 'avatar': 'https://i.pravatar.cc/150?img=9', 'hasStory': false},
      {'name': 'liam_code', 'avatar': 'https://i.pravatar.cc/150?img=33', 'hasStory': true},
      {'name': 'chloe_art', 'avatar': 'https://i.pravatar.cc/150?img=26', 'hasStory': true},
    ];

    return SizedBox(
      height: 98,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: mockStories.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            // First item: Current User "Your Story"
            return Padding(
              padding: const EdgeInsets.only(right: 14),
              child: Column(
                children: [
                  Stack(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(2.5),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.border, width: 1.5),
                        ),
                        child: CircleAvatar(
                          radius: 27,
                          backgroundColor: AppColors.accent.withValues(alpha: 0.15),
                          child: Text(
                            userInitial,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppColors.accent,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        right: 2,
                        bottom: 2,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: const BoxDecoration(
                            gradient: AppColors.accentGradient,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.add,
                            size: 13,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Your Story',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            );
          }

          final friend = mockStories[index - 1];
          final hasActiveStory = friend['hasStory'] as bool;
          final name = friend['name'] as String;

          return Padding(
            padding: const EdgeInsets.only(right: 14),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(2.5),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: hasActiveStory ? AppColors.accentGradient : null,
                    border: hasActiveStory
                        ? null
                        : Border.all(color: AppColors.border, width: 1.5),
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.background,
                    ),
                    child: CircleAvatar(
                      radius: 27,
                      backgroundColor: AppColors.surface,
                      child: Text(
                        name.substring(0, 1).toUpperCase(),
                        style: const TextStyle(
                          color: AppColors.accentLight,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                SizedBox(
                  width: 64,
                  child: Text(
                    name,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: hasActiveStory ? FontWeight.w600 : FontWeight.normal,
                      color: hasActiveStory ? AppColors.textPrimary : AppColors.textMuted,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
