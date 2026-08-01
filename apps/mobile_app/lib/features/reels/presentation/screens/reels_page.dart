import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Reels / Short Videos Page rendering vertical feed of reels.
class ReelsPage extends StatelessWidget {
  const ReelsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background Gradient / Simulated Video Reel
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1E1E2C), Color(0xFF0F0F1A)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.play_arrow_rounded,
                      size: 64,
                      color: AppColors.accentLight,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Campus Reels & Short Videos',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Swipe up for next reel',
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Right side action bar (Likes, Comments, Share)
          Positioned(
            right: 16,
            bottom: 80,
            child: Column(
              children: [
                _buildReelAction(Icons.favorite_rounded, '12.4K', const Color(0xFFFE0101)),
                const SizedBox(height: 20),
                _buildReelAction(Icons.chat_bubble_rounded, '842', Colors.white),
                const SizedBox(height: 20),
                _buildReelAction(Icons.send_rounded, 'Share', Colors.white),
                const SizedBox(height: 20),
                _buildReelAction(Icons.more_vert_rounded, '', Colors.white),
              ],
            ),
          ),

          // Bottom Reel Metadata
          Positioned(
            left: 16,
            bottom: 24,
            right: 80,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(
                      radius: 18,
                      backgroundColor: AppColors.accent,
                      child: Text('J', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      '@campus_creator',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('Follow', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  'Late night coding session at the campus lib! 🚀 #JibbleVibes #CampusLife',
                  style: TextStyle(color: Colors.white, fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReelAction(IconData icon, String label, Color iconColor) {
    return Column(
      children: [
        Icon(icon, size: 30, color: iconColor),
        if (label.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
        ],
      ],
    );
  }
}
