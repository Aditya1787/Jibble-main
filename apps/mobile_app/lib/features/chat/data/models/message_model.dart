class MessageModel {
  final String id;
  final String senderId;
  final String recipientId;
  final String type;
  final String? content;
  final String? mediaUrl;
  final String status;
  final DateTime createdAt;
  final bool isMine;

  const MessageModel({
    required this.id,
    required this.senderId,
    required this.recipientId,
    this.type = 'text',
    this.content,
    this.mediaUrl,
    this.status = 'sent',
    required this.createdAt,
    this.isMine = false,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'] as String? ?? '',
      senderId: json['senderId'] as String? ?? json['sender_id'] as String? ?? '',
      recipientId: json['recipientId'] as String? ?? json['recipient_id'] as String? ?? '',
      type: json['type'] as String? ?? 'text',
      content: json['content'] as String?,
      mediaUrl: json['mediaUrl'] as String? ?? json['media_url'] as String?,
      status: json['status'] as String? ?? 'sent',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? json['created_at'] as String? ?? '') ??
          DateTime.now(),
      isMine: json['isMine'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'senderId': senderId,
        'recipientId': recipientId,
        'type': type,
        'content': content,
        'mediaUrl': mediaUrl,
        'status': status,
        'createdAt': createdAt.toIso8601String(),
        'isMine': isMine,
      };
}
