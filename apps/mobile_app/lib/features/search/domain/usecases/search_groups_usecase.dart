import '../entities/search_result_entity.dart';
import '../repositories/search_repository.dart';

class SearchGroupsUseCase {
  final SearchRepository _repository;

  SearchGroupsUseCase(this._repository);

  Future<List<SearchResultEntity>> call(String query, {int limit = 15}) {
    return _repository.searchGroups(query, limit: limit);
  }
}
