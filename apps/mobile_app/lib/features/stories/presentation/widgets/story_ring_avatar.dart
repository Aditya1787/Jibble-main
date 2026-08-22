import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Reusable Avatar with dynamic story ring indicator (gradient border for unseen, subtle grey for seen).
class StoryRingAvatar extends StatelessWidget {
  final String? imageUrl;
  final String name;
  final double radius;
  final bool hasUnseenStory;
  final bool isMyStory;
  final VoidCallback onTap;

  const StoryRingAvatar({
    super.key,
    this.imageUrl,
    required this.name,
    this.radius = 32.0,
    this.hasUnseenStory = true,
    this.isMyStory = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(2.5),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: hasUnseenStory
                  ? const LinearGradient(
                      colors: [AppColors.accent, Color(0xFFFF5722), AppColors.accentLight],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    )
                  : null,
              color: hasUnseenStory ? null : Colors.grey.withValues(alpha: 0.3),
            ),
            child: Container(
              padding: const EdgeInsets.all(2.0),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: radius,
                    backgroundImage: imageUrl != null && imageUrl!.isNotEmpty
                        ? NetworkImage(imageUrl!)
                        : null,
                    backgroundColor: AppColors.accent,
                    child: imageUrl == null || imageUrl!.isEmpty
                        ? Text(
                            name.isNotEmpty ? name[0].toUpperCase() : 'U',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: radius * 0.7,
                            ),
                          )
                        : null,
                  ),
                  if (isMyStory)
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.add_rounded,
                          size: 14,
                          color: Colors.white,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 6),
          SizedBox(
            width: radius * 2.2,
            child: Text(
              name,
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 11,
                fontWeight: hasUnseenStory ? FontWeight.bold : FontWeight.normal,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
