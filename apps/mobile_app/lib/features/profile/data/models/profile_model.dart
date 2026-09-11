class ProfileModel {
  final String userId;
  final String username;
  final String displayName;
  final String? bio;
  final String? avatarUrl;
  final String? bannerUrl;
  final bool isVerified;
  final int followersCount;
  final int followingCount;
  final int postsCount;
  final String? collegeId;

  const ProfileModel({
    required this.userId,
    required this.username,
    required this.displayName,
    this.bio,
    this.avatarUrl,
    this.bannerUrl,
    this.isVerified = false,
    this.followersCount = 0,
    this.followingCount = 0,
    this.postsCount = 0,
    this.collegeId,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      userId: json['userId'] as String? ?? json['user_id'] as String? ?? '',
      username: json['username'] as String? ?? '',
      displayName: json['displayName'] as String? ?? json['display_name'] as String? ?? json['username'] as String? ?? '',
      bio: json['bio'] as String?,
      avatarUrl: json['avatarUrl'] as String? ?? json['avatar_url'] as String?,
      bannerUrl: json['bannerUrl'] as String? ?? json['banner_url'] as String?,
      isVerified: json['isVerified'] as bool? ?? json['is_verified'] as bool? ?? false,
      followersCount: json['followersCount'] as int? ?? json['followers_count'] as int? ?? 0,
      followingCount: json['followingCount'] as int? ?? json['following_count'] as int? ?? 0,
      postsCount: json['postsCount'] as int? ?? json['posts_count'] as int? ?? 0,
      collegeId: json['collegeId'] as String? ?? json['college_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'username': username,
        'displayName': displayName,
        'bio': bio,
        'avatarUrl': avatarUrl,
        'bannerUrl': bannerUrl,
        'isVerified': isVerified,
        'followersCount': followersCount,
        'followingCount': followingCount,
        'postsCount': postsCount,
        'collegeId': collegeId,
      };
}
