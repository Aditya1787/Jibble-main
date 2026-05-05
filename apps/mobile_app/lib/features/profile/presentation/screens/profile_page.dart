import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 24),
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      gradient: AppColors.accentGradient,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.surface, width: 4),
                    ),
                    child: const Center(
                      child: Text('U', style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.edit, size: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text('User Name', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: 4),
            const Text('Computer Science · Batch of 2026', style: TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildStat('Posts', '42'),
                  Container(width: 1, height: 30, color: AppColors.border),
                  _buildStat('Followers', '1.2k'),
                  Container(width: 1, height: 30, color: AppColors.border),
                  _buildStat('Following', '843'),
                ],
              ),
            ),
            const SizedBox(height: 32),
            DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  const TabBar(
                    indicatorColor: AppColors.accent,
                    labelColor: AppColors.accent,
                    unselectedLabelColor: AppColors.textMuted,
                    tabs: [
                      Tab(text: 'My Posts'),
                      Tab(text: 'Saved'),
                    ],
                  ),
                  SizedBox(
                    height: 400, // Fixed height for demo
                    child: TabBarView(
                      children: [
                        _buildPostsGrid(),
                        const Center(child: Text('No saved posts yet', style: TextStyle(color: AppColors.textMuted))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
      ],
    );
  }

  Widget _buildPostsGrid() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: 12,
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.border),
          ),
          child: const Center(
            child: Icon(Icons.image_outlined, color: AppColors.textMuted),
          ),
        );
      },
    );
  }
}
