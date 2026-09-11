import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/circle_member_model.dart';

/// Signature Jibble Circle Corner Ellipse / Radial Member Bar.
/// Renders active/online circle members floating along a stylized curved/arc layout
/// at the top corner of the Circle Home, horizontally scrollable with glowing status rings.
class CornerEllipseMemberBar extends StatelessWidget {
  final List<CircleMemberModel> members;
  final Function(CircleMemberModel member)? onMemberTap;

  const CornerEllipseMemberBar({
    super.key,
    required this.members,
    this.onMemberTap,
  });

  @override
  Widget build(BuildContext context) {
    if (members.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
          child: Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Color(0xFF00E676), // Glowing active green
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xFF00E676),
                      blurRadius: 6,
                      spreadRadius: 2,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'LIVE IN CIRCLE',
                style: TextStyle(
                  fontSize: 11,
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w800,
                  color: AppColors.accentLight,
                ),
              ),
              const Spacer(),
              Text(
                '${members.where((m) => m.isOnline).length} Active Now',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),

        // Horizontally scrollable floating ellipse/curved avatar tray
        SizedBox(
          height: 94,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 14),
            itemCount: members.length,
            itemBuilder: (context, index) {
              final member = members[index];
              // Give each avatar a subtle vertical oscillation offset to simulate a spatial arc
              final double arcOffset = (index % 2 == 0) ? -4.0 : 4.0;

              return Transform.translate(
                offset: Offset(0, arcOffset),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: GestureDetector(
                    onTap: () {
                      if (onMemberTap != null) {
                        onMemberTap!(member);
                      } else {
                        _showMemberPreviewDialog(context, member);
                      }
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Stack(
                          clipBehavior: Clip.none,
                          children: [
                            // Glowing Ring for Online status or Glass Ring
                            Container(
                              padding: const EdgeInsets.all(2.5),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: member.isOnline
                                    ? const LinearGradient(
                                        colors: [Color(0xFF00E676), AppColors.accent],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      )
                                    : LinearGradient(
                                        colors: [
                                          Colors.white24,
                                          Colors.white.withValues(alpha: 0.05),
                                        ],
                                      ),
                                boxShadow: member.isOnline
                                    ? [
                                        BoxShadow(
                                          color: const Color(0xFF00E676).withValues(alpha: 0.35),
                                          blurRadius: 10,
                                          offset: const Offset(0, 3),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: CircleAvatar(
                                radius: 24,
                                backgroundColor: const Color(0xFF222034),
                                backgroundImage: member.avatarUrl != null
                                    ? NetworkImage(member.avatarUrl!)
                                    : null,
                                child: member.avatarUrl == null
                                    ? Text(
                                        member.displayName.isNotEmpty
                                            ? member.displayName[0].toUpperCase()
                                            : 'U',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      )
                                    : null,
                              ),
                            ),

                            // Online dot badge
                            if (member.isOnline)
                              Positioned(
                                right: 1,
                                bottom: 1,
                                child: Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF00E676),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.black, width: 2),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 5),
                        SizedBox(
                          width: 62,
                          child: Text(
                            member.displayName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showMemberPreviewDialog(BuildContext context, CircleMemberModel member) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1B1B2A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 36,
              backgroundColor: AppColors.accent.withValues(alpha: 0.2),
              child: Text(
                member.displayName.isNotEmpty ? member.displayName[0].toUpperCase() : 'U',
                style: const TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 14),
            Text(
              member.displayName,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            Text(
              '@${member.username}',
              style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.accent.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                member.role.toUpperCase(),
                style: const TextStyle(fontSize: 11, color: AppColors.accent, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Close', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
