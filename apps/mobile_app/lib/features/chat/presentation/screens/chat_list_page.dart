import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class ChatListPage extends StatelessWidget {
  const ChatListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chats'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_square),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: 8,
        itemBuilder: (context, index) {
          return ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            leading: CircleAvatar(
              radius: 24,
              backgroundColor: AppColors.accent.withOpacity(0.2),
              child: const Icon(Icons.person, color: AppColors.accentLight),
            ),
            title: Text('Chat User ${index + 1}', style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            subtitle: const Text('Hey, are you going to the event later?', style: TextStyle(color: AppColors.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text('2:30 PM', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                const SizedBox(height: 4),
                if (index < 2)
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(
                      color: AppColors.accent,
                      shape: BoxShape.circle,
                    ),
                    child: const Text('1', style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
            onTap: () {},
          );
        },
      ),
    );
  }
}
