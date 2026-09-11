class AnonymousPostModel {
  final String id;
  final String? circleId;
  final String caption;
  final List<String> mediaUrls;
  final String type;
  final String anonymousAlias;
  final int likesCount;
  final int commentsCount;
  final String createdAt;
  final bool isLiked;

  const AnonymousPostModel({
    required this.id,
    this.circleId,
    required this.caption,
    this.mediaUrls = const [],
    this.type = 'text',
    required this.anonymousAlias,
    this.likesCount = 0,
    this.commentsCount = 0,
    required this.createdAt,
    this.isLiked = false,
  });

  factory AnonymousPostModel.fromJson(Map<String, dynamic> json) {
    return AnonymousPostModel(
      id: json['id'] as String,
      circleId: (json['circle_id'] ?? json['circleId']) as String?,
      caption: (json['caption'] as String?) ?? '',
      mediaUrls: (json['media_urls'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      type: (json['type'] as String?) ?? 'text',
      anonymousAlias: (json['anonymous_alias'] ?? json['anonymousAlias'] ?? 'Anonymous Member') as String,
      likesCount: (json['likes_count'] ?? json['likesCount']) as int? ?? 0,
      commentsCount: (json['comments_count'] ?? json['commentsCount']) as int? ?? 0,
      createdAt: (json['created_at'] ?? json['createdAt'] ?? DateTime.now().toIso8601String()) as String,
      isLiked: (json['is_liked'] ?? json['isLiked']) as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'circle_id': circleId,
        'caption': caption,
        'media_urls': mediaUrls,
        'type': type,
        'anonymous_alias': anonymousAlias,
        'likes_count': likesCount,
        'comments_count': commentsCount,
        'created_at': createdAt,
        'is_liked': isLiked,
      };

  AnonymousPostModel copyWith({
    bool? isLiked,
    int? likesCount,
  }) {
    return AnonymousPostModel(
      id: id,
      circleId: circleId,
      caption: caption,
      mediaUrls: mediaUrls,
      type: type,
      anonymousAlias: anonymousAlias,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount,
      createdAt: createdAt,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
