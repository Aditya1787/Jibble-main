import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class CirclePage extends StatelessWidget {
  const CirclePage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Circle'),
          bottom: const TabBar(
            indicatorColor: AppColors.accent,
            labelColor: AppColors.accent,
            unselectedLabelColor: AppColors.textMuted,
            tabs: [
              Tab(text: 'Members'),
              Tab(text: 'Groups'),
              Tab(text: 'Events'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildMembersList(),
            _buildGroupsList(),
            _buildEventsList(),
          ],
        ),
      ),
    );
  }

  Widget _buildMembersList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 15,
      itemBuilder: (context, index) {
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: AppColors.accent.withValues(alpha: 0.2),
            child: const Icon(Icons.person, color: AppColors.accentLight),
          ),
          title: Text('Student ${index + 1}', style: const TextStyle(color: AppColors.textPrimary)),
          subtitle: const Text('Computer Science', style: TextStyle(color: AppColors.textMuted)),
          trailing: ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(80, 36),
              backgroundColor: AppColors.surface,
              side: const BorderSide(color: AppColors.accent),
            ),
            child: const Text('Connect', style: TextStyle(color: AppColors.accent)),
          ),
        );
      },
    );
  }

  Widget _buildGroupsList() {
    return const Center(child: Text('Groups coming soon...', style: TextStyle(color: AppColors.textMuted)));
  }

  Widget _buildEventsList() {
    return const Center(child: Text('Events coming soon...', style: TextStyle(color: AppColors.textMuted)));
  }
}
