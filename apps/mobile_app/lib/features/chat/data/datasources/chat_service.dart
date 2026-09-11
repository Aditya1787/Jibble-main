import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/chat_model.dart';
import '../models/message_model.dart';

class ChatService {
  final ApiClient _client;

  ChatService({required ApiClient client}) : _client = client;

  Future<List<ChatModel>> getConversations() async {
    final response = await _client.dio.get(Endpoints.chatConversations);
    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => ChatModel.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<List<MessageModel>> getMessages(String recipientId, {int limit = 50, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.chatMessages(recipientId),
      queryParameters: {'limit': limit, 'offset': offset},
    );
    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => MessageModel.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<MessageModel> sendMessage(String recipientId, {required String content, String? mediaUrl}) async {
    final response = await _client.dio.post(
      Endpoints.chatSend,
      data: {
        'recipientId': recipientId,
        'content': content,
        if (mediaUrl != null) 'mediaUrl': mediaUrl,
      },
    );
    return MessageModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}
