import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/notification_model.dart';

class NotificationTile extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback? onTap;

  const NotificationTile({super.key, required this.notification, this.onTap});

  @override
  Widget build(BuildContext context) {
    IconData getNotificationIcon() {
      switch (notification.type) {
        case 'like_post':
          return Icons.favorite;
        case 'comment_post':
          return Icons.chat_bubble;
        case 'new_follower':
          return Icons.person_add;
        case 'event_invite':
          return Icons.event;
        default:
          return Icons.notifications;
      }
    }

    Color getNotificationColor() {
      switch (notification.type) {
        case 'like_post':
          return Colors.redAccent;
        case 'comment_post':
          return AppColors.neonCyan;
        case 'new_follower':
          return AppColors.primaryViolet;
        case 'event_invite':
          return Colors.amber;
        default:
          return AppColors.primaryViolet;
      }
    }

    return Container(
      color: notification.isRead ? Colors.transparent : AppColors.primaryViolet.withValues(alpha: 0.06),
      child: ListTile(
        onTap: onTap,
        leading: Stack(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.2),
              backgroundImage: notification.actorAvatar != null ? NetworkImage(notification.actorAvatar!) : null,
              child: notification.actorAvatar == null
                  ? Text(
                      notification.actorName?.isNotEmpty == true ? notification.actorName![0].toUpperCase() : 'J',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    )
                  : null,
            ),
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(
                  color: AppColors.bgDark,
                  shape: BoxShape.circle,
                ),
                child: Icon(getNotificationIcon(), color: getNotificationColor(), size: 12),
              ),
            ),
          ],
        ),
        title: Text(
          notification.title,
          style: TextStyle(
            color: Colors.white,
            fontWeight: notification.isRead ? FontWeight.normal : FontWeight.bold,
            fontSize: 14,
          ),
        ),
        subtitle: notification.body.isNotEmpty
            ? Text(
                notification.body,
                style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 13),
              )
            : null,
        trailing: notification.isRead
            ? null
            : Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.primaryViolet,
                  shape: BoxShape.circle,
                ),
              ),
      ),
    );
  }
}
