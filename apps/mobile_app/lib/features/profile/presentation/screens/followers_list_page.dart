import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class FollowersListPage extends StatelessWidget {
  final String title;

  const FollowersListPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: ListView.builder(
        itemCount: 8,
        itemBuilder: (context, index) {
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.2),
              child: Text('U$index', style: const TextStyle(color: Colors.white)),
            ),
            title: Text('User $index', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            subtitle: Text('@user_$index', style: TextStyle(color: Colors.white.withValues(alpha: 0.5))),
            trailing: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('Follow', style: TextStyle(color: Colors.white, fontSize: 13)),
            ),
          );
        },
      ),
    );
  }
}
