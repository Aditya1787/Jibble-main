class StoryEntity {
  final String id;
  final String userId;
  final String username;
  final String? avatarUrl;
  final String mediaUrl;
  final String? caption;
  final DateTime expiresAt;
  final DateTime createdAt;
  final bool isViewed;

  const StoryEntity({
    required this.id,
    required this.userId,
    required this.username,
    this.avatarUrl,
    required this.mediaUrl,
    this.caption,
    required this.expiresAt,
    required this.createdAt,
    this.isViewed = false,
  });

  factory StoryEntity.fromJson(Map<String, dynamic> json) {
    return StoryEntity(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? json['user_id'] as String? ?? '',
      username: json['username'] as String? ?? 'user',
      avatarUrl: json['avatarUrl'] as String? ?? json['avatar_url'] as String?,
      mediaUrl: json['mediaUrl'] as String? ?? json['media_url'] as String? ?? '',
      caption: json['caption'] as String?,
      expiresAt: DateTime.tryParse(json['expiresAt'] as String? ?? json['expires_at'] as String? ?? '') ??
          DateTime.now().add(const Duration(hours: 24)),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? json['created_at'] as String? ?? '') ??
          DateTime.now(),
      isViewed: json['isViewed'] as bool? ?? json['is_viewed'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'username': username,
        'avatarUrl': avatarUrl,
        'mediaUrl': mediaUrl,
        'caption': caption,
        'expiresAt': expiresAt.toIso8601String(),
        'createdAt': createdAt.toIso8601String(),
        'isViewed': isViewed,
      };
}
