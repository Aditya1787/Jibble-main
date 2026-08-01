import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/story_model.dart';

/// Neumorphic Story Bubble Widget with gradient unread ring and "+" add button.
class StoryBubbleWidget extends StatefulWidget {
  final UserStoryGroupModel group;
  final bool isCurrentUser;
  final VoidCallback onTap;

  const StoryBubbleWidget({
    super.key,
    required this.group,
    this.isCurrentUser = false,
    required this.onTap,
  });

  @override
  State<StoryBubbleWidget> createState() => _StoryBubbleWidgetState();
}

class _StoryBubbleWidgetState extends State<StoryBubbleWidget> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final hasStories = widget.group.stories.isNotEmpty;
    final hasUnread = widget.group.hasUnread;
    final initial = widget.group.username.isNotEmpty
        ? widget.group.username[0].toUpperCase()
        : 'U';

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _isPressed ? 0.93 : 1.0,
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOutCubic,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                // Outer Neumorphic Avatar Container with Gradient Border when Unread
                Container(
                  padding: const EdgeInsets.all(3.5),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: (hasStories && hasUnread)
                        ? AppColors.accentGradient
                        : null,
                    boxShadow: [
                      BoxShadow(
                        color: (hasStories && hasUnread)
                            ? AppColors.accent.withValues(alpha: 0.35)
                            : const Color(0xFFD2CDC3).withValues(alpha: 0.7),
                        blurRadius: (hasStories && hasUnread) ? 12 : 8,
                        offset: const Offset(3, 4),
                      ),
                      const BoxShadow(
                        color: Colors.white,
                        blurRadius: 8,
                        offset: Offset(-3, -3),
                      ),
                    ],
                  ),
                  child: Container(
                    padding: const EdgeInsets.all(2.5),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.background,
                    ),
                    child: widget.group.avatarUrl != null && widget.group.avatarUrl!.isNotEmpty
                        ? CircleAvatar(
                            radius: 27,
                            backgroundImage: NetworkImage(widget.group.avatarUrl!),
                          )
                        : CircleAvatar(
                            radius: 27,
                            backgroundColor: widget.isCurrentUser
                                ? AppColors.accent.withValues(alpha: 0.18)
                                : AppColors.card,
                            child: Text(
                              initial,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: widget.isCurrentUser
                                    ? AppColors.accent
                                    : AppColors.textPrimary,
                              ),
                            ),
                          ),
                  ),
                ),

                // Plus Icon Badge for Current User when adding a new story
                if (widget.isCurrentUser)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        gradient: AppColors.accentGradient,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.accent.withValues(alpha: 0.5),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
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
            const SizedBox(height: 6),

            // Username Label
            SizedBox(
              width: 68,
              child: Text(
                widget.isCurrentUser ? 'Your Story' : widget.group.username,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: hasUnread ? FontWeight.bold : FontWeight.w500,
                  color: hasUnread ? AppColors.textPrimary : AppColors.textMuted,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
