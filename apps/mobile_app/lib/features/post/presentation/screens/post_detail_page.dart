import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/post_model.dart';
import '../widgets/post_card_widget.dart';

class PostDetailPage extends StatelessWidget {
  final PostModel post;

  const PostDetailPage({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: const Text('Post', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            PostCardWidget(post: post),
            const Divider(color: Colors.white12),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Center(
                child: Text(
                  post.commentsCount < 0
                      ? 'Comments are disabled on this post.'
                      : 'No comments yet. Be the first to reply!',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
