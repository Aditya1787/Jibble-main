import 'package:flutter/material.dart';
import '../../domain/entities/chat_entity.dart';
import '../../domain/repositories/chat_repository.dart';

class ChatListProvider with ChangeNotifier {
  final ChatRepository _chatRepository;

  ChatListProvider({required ChatRepository chatRepository}) : _chatRepository = chatRepository;

  List<ChatEntity> _chats = [];
  bool _isLoading = false;
  String? _error;

  List<ChatEntity> get chats => _chats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchRecentChats() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _chats = await _chatRepository.getRecentChats();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
