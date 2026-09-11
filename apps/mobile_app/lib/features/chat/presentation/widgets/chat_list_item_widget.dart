import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/chat_entity.dart';

class ChatListItemWidget extends StatelessWidget {
  final ChatEntity chat;
  final VoidCallback? onTap;

  const ChatListItemWidget({super.key, required this.chat, this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.25),
        backgroundImage: chat.avatarUrl != null ? NetworkImage(chat.avatarUrl!) : null,
        child: chat.avatarUrl == null
            ? Text(
                chat.displayName.isNotEmpty ? chat.displayName[0].toUpperCase() : '?',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              )
            : null,
      ),
      title: Row(
        children: [
          Flexible(
            child: Text(
              chat.displayName,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (chat.isVerified) ...[
            const SizedBox(width: 4),
            const Icon(Icons.verified, color: AppColors.primaryViolet, size: 14),
          ],
        ],
      ),
      subtitle: Text(
        chat.lastMessage ?? 'Started a conversation',
        style: TextStyle(
          color: chat.unreadCount > 0 ? Colors.white : Colors.white54,
          fontWeight: chat.unreadCount > 0 ? FontWeight.bold : FontWeight.normal,
          fontSize: 13,
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: chat.unreadCount > 0
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
              decoration: const BoxDecoration(
                color: AppColors.primaryViolet,
                shape: BoxShape.circle,
              ),
              child: Text(
                '${chat.unreadCount}',
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            )
          : null,
    );
  }
}
