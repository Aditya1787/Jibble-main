import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/follow_entity.dart';
import 'follow_button_widget.dart';

class UserListItemWidget extends StatelessWidget {
  final FollowEntity user;
  final VoidCallback? onTap;
  final VoidCallback? onToggleFollow;

  const UserListItemWidget({
    super.key,
    required this.user,
    this.onTap,
    this.onToggleFollow,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.2),
        backgroundImage: user.avatarUrl != null ? NetworkImage(user.avatarUrl!) : null,
        child: user.avatarUrl == null
            ? Text(
                user.displayName.isNotEmpty ? user.displayName[0].toUpperCase() : '?',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              )
            : null,
      ),
      title: Row(
        children: [
          Flexible(
            child: Text(
              user.displayName,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (user.isVerified) ...[
            const SizedBox(width: 4),
            const Icon(Icons.verified, color: AppColors.primaryViolet, size: 14),
          ],
        ],
      ),
      subtitle: Text(
        '@${user.username}',
        style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 13),
      ),
      trailing: FollowButtonWidget(
        isFollowing: user.isFollowing,
        onToggle: onToggleFollow ?? () {},
      ),
    );
  }
}
