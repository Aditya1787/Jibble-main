import 'package:flutter/foundation.dart';

@immutable
class StoryItemModel {
  final String id;
  final String userId;
  final String type; // 'image', 'video', 'text', 'reel', 'post'
  final String? mediaUrl;
  final String? textContent;
  final String? musicTitle;
  final String? location;
  final String? sharedPostId;
  final String? sharedReelId;
  final DateTime createdAt;
  final bool hasViewed;

  const StoryItemModel({
    required this.id,
    required this.userId,
    this.type = 'image',
    this.mediaUrl,
    this.textContent,
    this.musicTitle,
    this.location,
    this.sharedPostId,
    this.sharedReelId,
    required this.createdAt,
    this.hasViewed = false,
  });

  factory StoryItemModel.fromJson(Map<String, dynamic> json) {
    return StoryItemModel(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      type: json['type'] as String? ?? 'image',
      mediaUrl: json['mediaUrl'] as String?,
      textContent: json['textContent'] as String?,
      musicTitle: json['music'] != null ? json['music']['title'] as String? : null,
      location: json['location'] as String?,
      sharedPostId: json['sharedPostId'] as String?,
      sharedReelId: json['sharedReelId'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      hasViewed: json['hasViewed'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'type': type,
      'mediaUrl': mediaUrl,
      'textContent': textContent,
      'music': musicTitle != null ? {'title': musicTitle} : null,
      'location': location,
      'sharedPostId': sharedPostId,
      'sharedReelId': sharedReelId,
      'createdAt': createdAt.toIso8601String(),
      'hasViewed': hasViewed,
    };
  }

  StoryItemModel copyWith({
    String? id,
    String? userId,
    String? type,
    String? mediaUrl,
    String? textContent,
    String? musicTitle,
    String? location,
    String? sharedPostId,
    String? sharedReelId,
    DateTime? createdAt,
    bool? hasViewed,
  }) {
    return StoryItemModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      mediaUrl: mediaUrl ?? this.mediaUrl,
      textContent: textContent ?? this.textContent,
      musicTitle: musicTitle ?? this.musicTitle,
      location: location ?? this.location,
      sharedPostId: sharedPostId ?? this.sharedPostId,
      sharedReelId: sharedReelId ?? this.sharedReelId,
      createdAt: createdAt ?? this.createdAt,
      hasViewed: hasViewed ?? this.hasViewed,
    );
  }
}

@immutable
class UserStoryGroupModel {
  final String userId;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final bool isVerified;
  final bool hasUnread;
  final List<StoryItemModel> stories;

  const UserStoryGroupModel({
    required this.userId,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    this.isVerified = false,
    this.hasUnread = true,
    required this.stories,
  });

  factory UserStoryGroupModel.fromJson(Map<String, dynamic> json) {
    final storiesList = (json['stories'] as List<dynamic>?)
            ?.map((e) => StoryItemModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return UserStoryGroupModel(
      userId: json['userId'] as String? ?? '',
      username: json['username'] as String? ?? 'user',
      displayName: json['displayName'] as String? ?? 'User',
      avatarUrl: json['avatarUrl'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
      hasUnread: json['hasUnread'] as bool? ?? true,
      stories: storiesList,
    );
  }

  UserStoryGroupModel copyWith({
    String? userId,
    String? username,
    String? displayName,
    String? avatarUrl,
    bool? isVerified,
    bool? hasUnread,
    List<StoryItemModel>? stories,
  }) {
    return UserStoryGroupModel(
      userId: userId ?? this.userId,
      username: username ?? this.username,
      displayName: displayName ?? this.displayName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      isVerified: isVerified ?? this.isVerified,
      hasUnread: hasUnread ?? this.hasUnread,
      stories: stories ?? this.stories,
    );
  }
}
