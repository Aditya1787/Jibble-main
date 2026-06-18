/// Represents the author of a Jibble post.
class AuthorModel {
  final String username;
  final String displayName;
  final String? avatarUrl;
  final bool isVerified;

  const AuthorModel({
    required this.username,
    required this.displayName,
    this.avatarUrl,
    required this.isVerified,
  });

  factory AuthorModel.fromJson(Map<String, dynamic> json) {
    return AuthorModel(
      username: json['username'] as String? ?? 'anonymous',
      displayName: json['displayName'] as String? ?? 'Anonymous',
      avatarUrl: json['avatarUrl'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'username': username,
        'displayName': displayName,
        'avatarUrl': avatarUrl,
        'isVerified': isVerified,
      };
}

/// Represents a link preview card.
class LinkPreviewModel {
  final String? title;
  final String? description;
  final String? imageUrl;

  const LinkPreviewModel({
    this.title,
    this.description,
    this.imageUrl,
  });

  factory LinkPreviewModel.fromJson(Map<String, dynamic> json) {
    return LinkPreviewModel(
      title: json['title'] as String?,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'title': title,
        'description': description,
        'imageUrl': imageUrl,
      };
}

/// Represents an option in a poll.
class PollOptionModel {
  final String id;
  final String text;
  final int votes;

  const PollOptionModel({
    required this.id,
    required this.text,
    required this.votes,
  });

  factory PollOptionModel.fromJson(Map<String, dynamic> json) {
    return PollOptionModel(
      id: json['id'] as String? ?? '',
      text: json['text'] as String? ?? '',
      votes: json['votes'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'text': text,
        'votes': votes,
      };
}

/// Core Jibble Post model representing a post.
class PostModel {
  final String id;
  final String userId;
  final String? collegeId;
  final String type; // 'text' | 'image' | 'video' | 'carousel' | 'link' | 'poll'
  final String visibility; // 'public' | 'followers' | 'college_only' | 'private'
  final String? caption;
  final List<String> mediaUrls;
  final String? thumbnailUrl;
  final String? linkUrl;
  final LinkPreviewModel? linkPreview;
  final List<PollOptionModel>? pollOptions;
  final String? pollEndsAt;
  final String? location;
  final List<String> hashtags;
  final List<String> mentions;
  final bool isPinned;
  final bool isArchived;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final int viewsCount;
  final String createdAt;
  final String updatedAt;
  final AuthorModel? author;
  final bool isLiked;

  const PostModel({
    required this.id,
    required this.userId,
    this.collegeId,
    required this.type,
    required this.visibility,
    this.caption,
    required this.mediaUrls,
    this.thumbnailUrl,
    this.linkUrl,
    this.linkPreview,
    this.pollOptions,
    this.pollEndsAt,
    this.location,
    required this.hashtags,
    required this.mentions,
    required this.isPinned,
    required this.isArchived,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.viewsCount,
    required this.createdAt,
    required this.updatedAt,
    this.author,
    required this.isLiked,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      collegeId: json['collegeId'] as String?,
      type: json['type'] as String? ?? 'text',
      visibility: json['visibility'] as String? ?? 'public',
      caption: json['caption'] as String?,
      mediaUrls: (json['mediaUrls'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      thumbnailUrl: json['thumbnailUrl'] as String?,
      linkUrl: json['linkUrl'] as String?,
      linkPreview: json['linkPreview'] != null
          ? LinkPreviewModel.fromJson(json['linkPreview'] as Map<String, dynamic>)
          : null,
      pollOptions: (json['pollOptions'] as List<dynamic>?)
          ?.map((e) => PollOptionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pollEndsAt: json['pollEndsAt'] as String?,
      location: json['location'] as String?,
      hashtags: (json['hashtags'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      mentions: (json['mentions'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      isPinned: json['isPinned'] as bool? ?? false,
      isArchived: json['isArchived'] as bool? ?? false,
      likesCount: json['likesCount'] as int? ?? 0,
      commentsCount: json['commentsCount'] as int? ?? 0,
      sharesCount: json['sharesCount'] as int? ?? 0,
      viewsCount: json['viewsCount'] as int? ?? 0,
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
      author: json['author'] != null
          ? AuthorModel.fromJson(json['author'] as Map<String, dynamic>)
          : null,
      isLiked: json['isLiked'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'collegeId': collegeId,
        'type': type,
        'visibility': visibility,
        'caption': caption,
        'mediaUrls': mediaUrls,
        'thumbnailUrl': thumbnailUrl,
        'linkUrl': linkUrl,
        'linkPreview': linkPreview?.toJson(),
        'pollOptions': pollOptions?.map((e) => e.toJson()).toList(),
        'pollEndsAt': pollEndsAt,
        'location': location,
        'hashtags': hashtags,
        'mentions': mentions,
        'isPinned': isPinned,
        'isArchived': isArchived,
        'likesCount': likesCount,
        'commentsCount': commentsCount,
        'sharesCount': sharesCount,
        'viewsCount': viewsCount,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
        'author': author?.toJson(),
        'isLiked': isLiked,
      };

  PostModel copyWith({
    String? id,
    String? userId,
    String? collegeId,
    String? type,
    String? visibility,
    String? caption,
    List<String>? mediaUrls,
    String? thumbnailUrl,
    String? linkUrl,
    LinkPreviewModel? linkPreview,
    List<PollOptionModel>? pollOptions,
    String? pollEndsAt,
    String? location,
    List<String>? hashtags,
    List<String>? mentions,
    bool? isPinned,
    bool? isArchived,
    int? likesCount,
    int? commentsCount,
    int? sharesCount,
    int? viewsCount,
    String? createdAt,
    String? updatedAt,
    AuthorModel? author,
    bool? isLiked,
  }) {
    return PostModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      collegeId: collegeId ?? this.collegeId,
      type: type ?? this.type,
      visibility: visibility ?? this.visibility,
      caption: caption ?? this.caption,
      mediaUrls: mediaUrls ?? this.mediaUrls,
      thumbnailUrl: thumbnailUrl ?? this.thumbnailUrl,
      linkUrl: linkUrl ?? this.linkUrl,
      linkPreview: linkPreview ?? this.linkPreview,
      pollOptions: pollOptions ?? this.pollOptions,
      pollEndsAt: pollEndsAt ?? this.pollEndsAt,
      location: location ?? this.location,
      hashtags: hashtags ?? this.hashtags,
      mentions: mentions ?? this.mentions,
      isPinned: isPinned ?? this.isPinned,
      isArchived: isArchived ?? this.isArchived,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      viewsCount: viewsCount ?? this.viewsCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      author: author ?? this.author,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
