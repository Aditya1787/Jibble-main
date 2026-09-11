import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/message_entity.dart';

class MessageBubbleWidget extends StatelessWidget {
  final MessageEntity message;

  const MessageBubbleWidget({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final isMine = message.isMine;

    return Align(
      alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isMine ? AppColors.primaryViolet : AppColors.surfaceDark,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isMine ? const Radius.circular(16) : const Radius.circular(4),
            bottomRight: isMine ? const Radius.circular(4) : const Radius.circular(16),
          ),
          border: isMine ? null : Border.all(color: Colors.white.withValues(alpha: 0.08)),
        ),
        child: Column(
          crossAxisAlignment: isMine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            if (message.content != null)
              Text(
                message.content!,
                style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.3),
              ),
            const SizedBox(height: 4),
            Text(
              '${message.createdAt.hour.toString().padLeft(2, '0')}:${message.createdAt.minute.toString().padLeft(2, '0')}',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}
