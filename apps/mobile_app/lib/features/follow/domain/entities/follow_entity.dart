class FollowEntity {
  final String userId;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final bool isVerified;
  final bool isFollowing;

  const FollowEntity({
    required this.userId,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    this.isVerified = false,
    this.isFollowing = false,
  });

  factory FollowEntity.fromJson(Map<String, dynamic> json) {
    return FollowEntity(
      userId: json['userId'] as String? ?? json['user_id'] as String? ?? '',
      username: json['username'] as String? ?? 'user',
      displayName: json['displayName'] as String? ?? json['display_name'] as String? ?? 'User',
      avatarUrl: json['avatarUrl'] as String? ?? json['avatar_url'] as String?,
      isVerified: json['isVerified'] as bool? ?? json['is_verified'] as bool? ?? false,
      isFollowing: json['isFollowing'] as bool? ?? false,
    );
  }
}
