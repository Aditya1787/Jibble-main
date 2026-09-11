import '../entities/search_result_entity.dart';
import '../repositories/search_repository.dart';

class SearchUsersUseCase {
  final SearchRepository _repository;

  SearchUsersUseCase(this._repository);

  Future<List<SearchResultEntity>> call(String query, {int limit = 15}) {
    return _repository.searchUsers(query, limit: limit);
  }
}
