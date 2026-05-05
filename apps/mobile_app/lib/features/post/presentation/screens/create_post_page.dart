import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class CreatePostPage extends StatelessWidget {
  const CreatePostPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Post'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Post', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.accent,
                  child: const Text('ME', style: TextStyle(color: Colors.white)),
                ),
                const SizedBox(width: 12),
                const Text('What\'s on your mind?', style: TextStyle(color: AppColors.textPrimary, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 16),
            const Expanded(
              child: TextField(
                maxLines: null,
                style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
                decoration: InputDecoration(
                  hintText: 'Share something with your college...',
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  filled: false,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  IconButton(icon: const Icon(Icons.image_outlined, color: AppColors.accent), onPressed: () {}),
                  IconButton(icon: const Icon(Icons.gif_box_outlined, color: AppColors.accent), onPressed: () {}),
                  IconButton(icon: const Icon(Icons.poll_outlined, color: AppColors.accent), onPressed: () {}),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
