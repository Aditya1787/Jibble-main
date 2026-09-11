class CircleMemberModel {
  final String id;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final String role;
  final bool isOnline;

  const CircleMemberModel({
    required this.id,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    required this.role,
    this.isOnline = false,
  });

  factory CircleMemberModel.fromJson(Map<String, dynamic> json) {
    return CircleMemberModel(
      id: json['id'] as String,
      username: (json['username'] as String?) ?? 'member',
      displayName: (json['displayName'] as String?) ?? (json['username'] as String?) ?? 'Community Member',
      avatarUrl: json['avatarUrl'] as String?,
      role: (json['role'] as String?) ?? 'member',
      isOnline: (json['isOnline'] as bool?) ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'displayName': displayName,
        'avatarUrl': avatarUrl,
        'role': role,
        'isOnline': isOnline,
      };
}
