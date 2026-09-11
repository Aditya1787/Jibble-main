class GroupModel {
  final String id;
  final String circleId;
  final String name;
  final String? description;
  final String iconName;
  final bool isPrivate;
  final int membersCount;
  final bool isMember;
  final String createdAt;

  const GroupModel({
    required this.id,
    required this.circleId,
    required this.name,
    this.description,
    this.iconName = 'group',
    this.isPrivate = false,
    this.membersCount = 1,
    this.isMember = false,
    required this.createdAt,
  });

  factory GroupModel.fromJson(Map<String, dynamic> json) {
    return GroupModel(
      id: json['id'] as String,
      circleId: (json['circle_id'] ?? json['circleId']) as String,
      name: (json['name'] as String?) ?? 'Sub-group',
      description: json['description'] as String?,
      iconName: (json['icon_name'] ?? json['iconName'] ?? 'group') as String,
      isPrivate: (json['is_private'] ?? json['isPrivate']) as bool? ?? false,
      membersCount: (json['members_count'] ?? json['membersCount']) as int? ?? 1,
      isMember: (json['is_member'] ?? json['isMember']) as bool? ?? false,
      createdAt: (json['created_at'] ?? json['createdAt'] ?? DateTime.now().toIso8601String()) as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'circle_id': circleId,
        'name': name,
        'description': description,
        'icon_name': iconName,
        'is_private': isPrivate,
        'members_count': membersCount,
        'is_member': isMember,
        'created_at': createdAt,
      };

  GroupModel copyWith({
    bool? isMember,
    int? membersCount,
  }) {
    return GroupModel(
      id: id,
      circleId: circleId,
      name: name,
      description: description,
      iconName: iconName,
      isPrivate: isPrivate,
      membersCount: membersCount ?? this.membersCount,
      isMember: isMember ?? this.isMember,
      createdAt: createdAt,
    );
  }
}
