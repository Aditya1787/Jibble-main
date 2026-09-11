import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class FollowButtonWidget extends StatelessWidget {
  final bool isFollowing;
  final VoidCallback onToggle;
  final bool isLoading;

  const FollowButtonWidget({
    super.key,
    required this.isFollowing,
    required this.onToggle,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const SizedBox(
        width: 24,
        height: 24,
        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryViolet),
      );
    }

    return ElevatedButton(
      onPressed: onToggle,
      style: ElevatedButton.styleFrom(
        backgroundColor: isFollowing ? Colors.white.withValues(alpha: 0.1) : AppColors.primaryViolet,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        elevation: 0,
      ),
      child: Text(
        isFollowing ? 'Following' : 'Follow',
        style: TextStyle(
          color: isFollowing ? Colors.white70 : Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
