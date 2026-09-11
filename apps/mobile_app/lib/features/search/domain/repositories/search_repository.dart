import '../entities/search_result_entity.dart';

abstract class SearchRepository {
  Future<List<SearchResultEntity>> search(String query, {String type = 'all', int limit = 15});
  Future<List<SearchResultEntity>> searchUsers(String query, {int limit = 15});
  Future<List<SearchResultEntity>> searchEvents(String query, {int limit = 15});
  Future<List<SearchResultEntity>> searchGroups(String query, {int limit = 15});
}
