/// Domain entity representing an authenticated user.
///
/// Kept deliberately thin — the full profile data lives in [ProfileEntity].
class UserEntity {
  final String id;
  final String email;
  final String? phone;
  final String status;
  final String provider;
  final bool emailVerified;
  final DateTime? createdAt;

  const UserEntity({
    required this.id,
    required this.email,
    this.phone,
    required this.status,
    required this.provider,
    required this.emailVerified,
    this.createdAt,
  });

  bool get isActive => status == 'active';
  bool get isLocalUser => provider == 'local';

  @override
  String toString() =>
      'UserEntity(id: $id, email: $email, status: $status)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserEntity &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
