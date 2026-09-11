import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/notification_model.dart';
import '../widgets/notification_tile.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final List<NotificationModel> _notifications = [
    NotificationModel(
      id: '1',
      title: 'New Like',
      body: 'elena_v liked your recent post about Flutter engineering.',
      type: 'like_post',
      isRead: false,
      createdAt: DateTime.now().subtract(const Duration(minutes: 15)),
      actorName: 'Elena Vance',
    ),
    NotificationModel(
      id: '2',
      title: 'Event Reminder',
      body: 'Hackathon 2026 Kickoff starts in 2 hours!',
      type: 'event_invite',
      isRead: false,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      actorName: 'Stanford AI & Robotics',
    ),
    NotificationModel(
      id: '3',
      title: 'New Follower',
      body: 'marcus_chen started following you.',
      type: 'new_follower',
      isRead: true,
      createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      actorName: 'Marcus Chen',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: const Text('Notifications', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                for (var i = 0; i < _notifications.length; i++) {
                  _notifications[i] = NotificationModel(
                    id: _notifications[i].id,
                    title: _notifications[i].title,
                    body: _notifications[i].body,
                    type: _notifications[i].type,
                    isRead: true,
                    createdAt: _notifications[i].createdAt,
                    actorName: _notifications[i].actorName,
                  );
                }
              });
            },
            child: const Text('Mark all read', style: TextStyle(color: AppColors.primaryViolet, fontSize: 13)),
          ),
        ],
      ),
      body: _notifications.isEmpty
          ? Center(
              child: Text(
                'No notifications yet',
                style: TextStyle(color: Colors.white.withValues(alpha: 0.5)),
              ),
            )
          : ListView.separated(
              itemCount: _notifications.length,
              separatorBuilder: (_, __) => const Divider(color: Colors.white10, height: 1),
              itemBuilder: (context, index) {
                return NotificationTile(
                  notification: _notifications[index],
                  onTap: () {
                    setState(() {
                      _notifications[index] = NotificationModel(
                        id: _notifications[index].id,
                        title: _notifications[index].title,
                        body: _notifications[index].body,
                        type: _notifications[index].type,
                        isRead: true,
                        createdAt: _notifications[index].createdAt,
                        actorName: _notifications[index].actorName,
                      );
                    });
                  },
                );
              },
            ),
    );
  }
}
