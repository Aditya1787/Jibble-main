import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:jibble_mobile/features/post/data/models/post_model.dart';
import 'package:jibble_mobile/features/post/presentation/widgets/post_card_widget.dart';

void main() {
  Widget buildTestWidget(PostModel post) {
    return MaterialApp(
      home: Scaffold(
        body: PostCardWidget(
          post: post,
          onLike: () {},
          onComment: () {},
        ),
      ),
    );
  }

  group('PostCardWidget Privacy & Metric Masking Tests', () {
    testWidgets('Renders exact counts when privacy metrics are visible', (tester) async {
      const post = PostModel(
        id: 'post-1',
        userId: 'u-1',
        type: 'text',
        visibility: 'public',
        caption: 'Public post caption',
        mediaUrls: [],
        hashtags: [],
        mentions: [],
        isPinned: false,
        isArchived: false,
        likesCount: 42,
        commentsCount: 7,
        sharesCount: 3,
        viewsCount: 150,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        author: AuthorModel(
          username: 'johndoe',
          displayName: 'John Doe',
          isVerified: true,
        ),
        isLiked: false,
      );

      await tester.pumpWidget(buildTestWidget(post));

      expect(find.text('42'), findsOneWidget);
      expect(find.text('7'), findsOneWidget);
      expect(find.text('Likes'), findsNothing);
      expect(find.text('Off'), findsNothing);
    });

    testWidgets('Masks like and view metrics when hide_likes_views is active (likesCount == -1)', (tester) async {
      const hiddenPost = PostModel(
        id: 'post-2',
        userId: 'creator-1',
        type: 'text',
        visibility: 'public',
        caption: 'Creator post with hidden likes and views',
        mediaUrls: [],
        hashtags: [],
        mentions: [],
        isPinned: false,
        isArchived: false,
        likesCount: -1, // Creator privacy active for viewers
        commentsCount: 12,
        sharesCount: 1,
        viewsCount: -1, // Creator privacy active for viewers
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        author: AuthorModel(
          username: 'art_creator',
          displayName: 'Art Creator',
          isVerified: false,
        ),
        isLiked: true,
      );

      await tester.pumpWidget(buildTestWidget(hiddenPost));

      // Must display masked 'Likes' label, NOT '-1'
      expect(find.text('Likes'), findsOneWidget);
      expect(find.text('-1'), findsNothing);
      expect(find.text('12'), findsOneWidget);
    });

    testWidgets('Displays "Off" when creator disables comments (commentsCount == -1)', (tester) async {
      const disabledCommentsPost = PostModel(
        id: 'post-3',
        userId: 'creator-1',
        type: 'text',
        visibility: 'public',
        caption: 'No comments allowed here',
        mediaUrls: [],
        hashtags: [],
        mentions: [],
        isPinned: false,
        isArchived: false,
        likesCount: 10,
        commentsCount: -1, // Comments disabled
        sharesCount: 0,
        viewsCount: 100,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        author: AuthorModel(
          username: 'mod_user',
          displayName: 'Moderator',
          isVerified: true,
        ),
        isLiked: false,
      );

      await tester.pumpWidget(buildTestWidget(disabledCommentsPost));

      expect(find.text('Off'), findsOneWidget);
      expect(find.text('10'), findsOneWidget);
    });
  });
}
