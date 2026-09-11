import '../../domain/entities/search_result_entity.dart';
import '../../domain/repositories/search_repository.dart';
import '../datasources/search_service.dart';

class SearchRepositoryImpl implements SearchRepository {
  final SearchService _service;

  SearchRepositoryImpl({required SearchService service}) : _service = service;

  @override
  Future<List<SearchResultEntity>> search(String query, {String type = 'all', int limit = 15}) {
    return _service.search(query, type: type, limit: limit);
  }

  @override
  Future<List<SearchResultEntity>> searchUsers(String query, {int limit = 15}) {
    return _service.search(query, type: 'users', limit: limit);
  }

  @override
  Future<List<SearchResultEntity>> searchEvents(String query, {int limit = 15}) {
    return _service.search(query, type: 'events', limit: limit);
  }

  @override
  Future<List<SearchResultEntity>> searchGroups(String query, {int limit = 15}) {
    return _service.search(query, type: 'groups', limit: limit);
  }
}
