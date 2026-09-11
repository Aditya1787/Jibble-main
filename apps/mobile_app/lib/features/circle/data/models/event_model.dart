class EventModel {
  final String id;
  final String? circleId;
  final String title;
  final String? description;
  final String? coverUrl;
  final String? locationName;
  final String startsAt;
  final String endsAt;
  final String? joinLink;
  final bool isOnline;
  final int attendeesCount;
  final bool isAttending;

  const EventModel({
    required this.id,
    this.circleId,
    required this.title,
    this.description,
    this.coverUrl,
    this.locationName,
    required this.startsAt,
    required this.endsAt,
    this.joinLink,
    this.isOnline = false,
    this.attendeesCount = 0,
    this.isAttending = false,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['id'] as String,
      circleId: json['circle_id'] as String?,
      title: (json['title'] as String?) ?? 'Community Event',
      description: json['description'] as String?,
      coverUrl: (json['cover_url'] ?? json['coverUrl']) as String?,
      locationName: (json['location_name'] ?? json['locationName']) as String?,
      startsAt: (json['starts_at'] ?? json['startsAt'] ?? DateTime.now().toIso8601String()) as String,
      endsAt: (json['ends_at'] ?? json['endsAt'] ?? DateTime.now().add(const Duration(hours: 2)).toIso8601String()) as String,
      joinLink: (json['join_link'] ?? json['joinLink'] ?? json['online_link']) as String?,
      isOnline: (json['is_online'] ?? json['isOnline']) as bool? ?? false,
      attendeesCount: (json['attendees_count'] ?? json['attendeesCount']) as int? ?? 0,
      isAttending: (json['is_attending'] ?? json['isAttending']) as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'circle_id': circleId,
        'title': title,
        'description': description,
        'cover_url': coverUrl,
        'location_name': locationName,
        'starts_at': startsAt,
        'ends_at': endsAt,
        'join_link': joinLink,
        'is_online': isOnline,
        'attendees_count': attendeesCount,
        'is_attending': isAttending,
      };

  EventModel copyWith({
    bool? isAttending,
    int? attendeesCount,
  }) {
    return EventModel(
      id: id,
      circleId: circleId,
      title: title,
      description: description,
      coverUrl: coverUrl,
      locationName: locationName,
      startsAt: startsAt,
      endsAt: endsAt,
      joinLink: joinLink,
      isOnline: isOnline,
      attendeesCount: attendeesCount ?? this.attendeesCount,
      isAttending: isAttending ?? this.isAttending,
    );
  }
}
