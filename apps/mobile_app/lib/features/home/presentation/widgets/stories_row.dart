import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../stories/presentation/provider/stories_provider.dart';
import '../../../stories/presentation/widgets/story_bubble_widget.dart';
import '../../../stories/presentation/screens/story_viewer_page.dart';
import '../../../story/presentation/screens/create_story_page.dart';

/// Horizontal Neumorphic Stories Row powered by Riverpod state.
class StoriesRow extends ConsumerWidget {
  const StoriesRow({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storiesState = ref.watch(storiesProvider);
    final groups = storiesState.storyGroups;

    if (storiesState.status == StoriesStatus.loading && groups.isEmpty) {
      return const SizedBox(
        height: 98,
        child: Center(
          child: SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2.0),
          ),
        ),
      );
    }

    return SizedBox(
      height: 98,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        itemCount: groups.length,
        itemBuilder: (context, index) {
          final group = groups[index];
          final isCurrentUser = index == 0;

          return Padding(
            padding: const EdgeInsets.only(right: 14),
            child: StoryBubbleWidget(
              group: group,
              isCurrentUser: isCurrentUser,
              onTap: () {
                if (isCurrentUser && group.stories.isEmpty) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CreateStoryPage()),
                  );
                } else {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => StoryViewerPage(
                        storyGroups: groups,
                        initialGroupIndex: index,
                      ),
                    ),
                  );
                }
              },
            ),
          );
        },
      ),
    );
  }
}
