class SearchResultModel {
  final String id;
  final String type; // 'user' | 'circle' | 'event' | 'group'
  final String title;
  final String? subtitle;
  final String? avatarUrl;
  final String? extraInfo;

  const SearchResultModel({
    required this.id,
    required this.type,
    required this.title,
    this.subtitle,
    this.avatarUrl,
    this.extraInfo,
  });

  factory SearchResultModel.fromJson(Map<String, dynamic> json, String type) {
    if (type == 'user') {
      return SearchResultModel(
        id: json['id'] as String? ?? '',
        type: 'user',
        title: json['displayName'] as String? ?? json['username'] as String? ?? 'User',
        subtitle: '@${json['username']}',
        avatarUrl: json['avatarUrl'] as String?,
        extraInfo: json['bio'] as String?,
      );
    } else if (type == 'circle') {
      return SearchResultModel(
        id: json['id'] as String? ?? '',
        type: 'circle',
        title: json['name'] as String? ?? 'Circle',
        subtitle: '${json['membersCount'] ?? 0} members',
        avatarUrl: json['avatarUrl'] as String?,
        extraInfo: json['description'] as String?,
      );
    } else if (type == 'event') {
      return SearchResultModel(
        id: json['id'] as String? ?? '',
        type: 'event',
        title: json['title'] as String? ?? 'Event',
        subtitle: json['locationName'] as String? ?? 'Online',
        avatarUrl: json['coverUrl'] as String?,
        extraInfo: json['joinLink'] as String?,
      );
    } else {
      return SearchResultModel(
        id: json['id'] as String? ?? '',
        type: 'group',
        title: json['name'] as String? ?? 'Group',
        subtitle: '${json['membersCount'] ?? 0} members',
        avatarUrl: null,
        extraInfo: json['description'] as String?,
      );
    }
  }
}
