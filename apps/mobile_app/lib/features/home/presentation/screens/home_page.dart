import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        leading: IconButton(
          icon: const Icon(Icons.notifications_none),
          onPressed: () {},
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 10,
        itemBuilder: (context, index) {
          return Card(
            color: AppColors.card,
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: AppColors.accent,
                        child: Text('U${index + 1}', style: const TextStyle(color: Colors.white)),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('User Name', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                            Text('2 hours ago', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                          ],
                        ),
                      ),
                      const Icon(Icons.more_horiz, color: AppColors.textMuted),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'This is a sample post content. Jibble is an awesome college social platform! 🎉',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _buildAction(Icons.favorite_border, '124'),
                      const SizedBox(width: 24),
                      _buildAction(Icons.chat_bubble_outline, '32'),
                      const SizedBox(width: 24),
                      _buildAction(Icons.share_outlined, 'Share'),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildAction(IconData icon, String label) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.textMuted),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(color: AppColors.textMuted)),
      ],
    );
  }
}
