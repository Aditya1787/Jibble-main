import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/circle_member_model.dart';
import '../widgets/corner_ellipse_member_bar.dart';

class CircleHomePage extends StatefulWidget {
  final String circleId;
  final String circleName;
  final VoidCallback onGoToEvents;
  final VoidCallback onGoToAnonymous;
  final VoidCallback onGoToGroups;

  const CircleHomePage({
    super.key,
    required this.circleId,
    this.circleName = 'CSE Community',
    required this.onGoToEvents,
    required this.onGoToAnonymous,
    required this.onGoToGroups,
  });

  @override
  State<CircleHomePage> createState() => _CircleHomePageState();
}

class _CircleHomePageState extends State<CircleHomePage> {
  // Sample active online circle members for signature corner ellipse bar
  final List<CircleMemberModel> _onlineMembers = const [
    CircleMemberModel(id: 'm-1', username: 'alex_code', displayName: 'Alex Chen', role: 'admin', isOnline: true),
    CircleMemberModel(id: 'm-2', username: 'priya_tech', displayName: 'Priya Sharma', role: 'member', isOnline: true),
    CircleMemberModel(id: 'm-3', username: 'marcus_ai', displayName: 'Marcus Vance', role: 'creator', isOnline: true),
    CircleMemberModel(id: 'm-4', username: 'sara_design', displayName: 'Sara Miller', role: 'member', isOnline: true),
    CircleMemberModel(id: 'm-5', username: 'dev_rohit', displayName: 'Rohit K', role: 'member', isOnline: true),
    CircleMemberModel(id: 'm-6', username: 'elena_v', displayName: 'Elena Rostova', role: 'member', isOnline: false),
    CircleMemberModel(id: 'm-7', username: 'john_doe', displayName: 'John D', role: 'member', isOnline: false),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 30),
      children: [
        // 1. Signature Jibble Corner Ellipse Online Member Bar
        CornerEllipseMemberBar(members: _onlineMembers),

        const Divider(color: Colors.white10, height: 24),

        // 2. Central Activity Stream Header
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 18, vertical: 4),
          child: Row(
            children: [
              Icon(Icons.dynamic_feed_rounded, color: AppColors.accent, size: 20),
              SizedBox(width: 8),
              Text(
                'COMMUNITY ACTIVITY STREAM',
                style: TextStyle(
                  fontSize: 12,
                  letterSpacing: 1.1,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 10),

        // 3. Featured Upcoming Event Card (with Join Event CTA)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.accent.withValues(alpha: 0.25),
                  const Color(0xFF1F1D36),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.accent.withValues(alpha: 0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'FEATURED EVENT',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                    const Spacer(),
                    const Text('Saturday • 10:00 AM', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  'Annual Campus Hackathon & Demo Day 2026',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Build innovative AI & web solutions with student developers across universities.',
                  style: TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    const Text('142 Registered', style: TextStyle(color: AppColors.accentLight, fontSize: 12, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: widget.onGoToEvents,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('View & Join Event', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // 4. Anonymous Confession Feed Card
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1C2E),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(color: Color(0xFF7C4DFF), shape: BoxShape.circle),
                      child: const Icon(Icons.masks_rounded, size: 14, color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Anonymous Lynx',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const Spacer(),
                    const Text('1h ago', style: TextStyle(color: Colors.white38, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  '"Anyone attending the Flutter conference workshop this Friday? Looking for team partners for the app sprint!"',
                  style: TextStyle(color: Colors.white, fontSize: 13, height: 1.35),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.favorite_rounded, color: Colors.redAccent, size: 16),
                    const SizedBox(width: 4),
                    const Text('28', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    const SizedBox(width: 14),
                    const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white54, size: 16),
                    const SizedBox(width: 4),
                    const Text('7', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    const Spacer(),
                    TextButton(
                      onPressed: widget.onGoToAnonymous,
                      child: const Text('Go to Confessions →', style: TextStyle(color: Color(0xFFB388FF), fontSize: 11)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // 5. Active Sub-Group Activity Card
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.code_rounded, color: AppColors.accent, size: 24),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Flutter & Dart Developers',
                        style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      SizedBox(height: 2),
                      Text(
                        '12 new messages in sub-group chat',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: widget.onGoToGroups,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.surface,
                    side: const BorderSide(color: AppColors.border),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Open', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
