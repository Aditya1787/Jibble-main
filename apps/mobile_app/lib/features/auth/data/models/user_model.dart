/// User model returned by the Jibble backend.
///
/// Maps from the `UserDto` shape returned by `/auth/me`, `/auth/login`, etc.
class UserModel {
  final String id;
  final String email;
  final String? phone;
  final String status;
  final String provider;
  final bool emailVerified;
  final String? createdAt;

  const UserModel({
    required this.id,
    required this.email,
    this.phone,
    required this.status,
    required this.provider,
    required this.emailVerified,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: (json['email'] as String?) ?? '',
      phone: json['phone'] as String?,
      status: (json['status'] as String?) ?? 'active',
      provider: (json['provider'] as String?) ?? 'local',
      emailVerified: (json['emailVerified'] as bool?) ?? false,
      createdAt: json['createdAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'phone': phone,
        'status': status,
        'provider': provider,
        'emailVerified': emailVerified,
        'createdAt': createdAt,
      };

  UserModel copyWith({
    String? id,
    String? email,
    String? phone,
    String? status,
    String? provider,
    bool? emailVerified,
    String? createdAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      status: status ?? this.status,
      provider: provider ?? this.provider,
      emailVerified: emailVerified ?? this.emailVerified,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() =>
      'UserModel(id: $id, email: $email, status: $status, provider: $provider)';
}
