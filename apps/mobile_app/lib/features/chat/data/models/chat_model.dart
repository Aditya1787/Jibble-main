class ChatModel {
  final String otherUserId;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final bool isVerified;
  final String? lastMessage;
  final DateTime? lastMessageTime;
  final int unreadCount;

  const ChatModel({
    required this.otherUserId,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    this.isVerified = false,
    this.lastMessage,
    this.lastMessageTime,
    this.unreadCount = 0,
  });

  factory ChatModel.fromJson(Map<String, dynamic> json) {
    return ChatModel(
      otherUserId: json['otherUserId'] as String? ?? json['other_user_id'] as String? ?? '',
      username: json['username'] as String? ?? 'user',
      displayName: json['displayName'] as String? ?? json['display_name'] as String? ?? 'User',
      avatarUrl: json['avatarUrl'] as String? ?? json['avatar_url'] as String?,
      isVerified: json['isVerified'] as bool? ?? json['is_verified'] as bool? ?? false,
      lastMessage: json['lastMessage'] as String? ?? json['last_message'] as String?,
      lastMessageTime: json['lastMessageTime'] != null
          ? DateTime.tryParse(json['lastMessageTime'] as String)
          : json['last_message_time'] != null
              ? DateTime.tryParse(json['last_message_time'] as String)
              : null,
      unreadCount: json['unreadCount'] as int? ?? json['unread_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'otherUserId': otherUserId,
        'username': username,
        'displayName': displayName,
        'avatarUrl': avatarUrl,
        'isVerified': isVerified,
        'lastMessage': lastMessage,
        'lastMessageTime': lastMessageTime?.toIso8601String(),
        'unreadCount': unreadCount,
      };
}
