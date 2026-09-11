class NotificationModel {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool isRead;
  final DateTime createdAt;
  final String? deepLink;
  final String? actorName;
  final String? actorAvatar;

  const NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.isRead,
    required this.createdAt,
    this.deepLink,
    this.actorName,
    this.actorAvatar,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    final actor = json['actor'] as Map<String, dynamic>?;
    return NotificationModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? 'Notification',
      body: json['body'] as String? ?? '',
      type: json['type'] as String? ?? 'system',
      isRead: json['isRead'] as bool? ?? json['is_read'] as bool? ?? false,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? json['created_at'] as String? ?? '') ??
          DateTime.now(),
      deepLink: json['deepLink'] as String? ?? json['deep_link'] as String?,
      actorName: actor?['displayName'] as String? ?? actor?['username'] as String?,
      actorAvatar: actor?['avatarUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'body': body,
        'type': type,
        'isRead': isRead,
        'createdAt': createdAt.toIso8601String(),
        'deepLink': deepLink,
        'actorName': actorName,
        'actorAvatar': actorAvatar,
      };
}
