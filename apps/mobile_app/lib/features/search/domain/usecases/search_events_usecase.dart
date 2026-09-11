import '../entities/search_result_entity.dart';
import '../repositories/search_repository.dart';

class SearchEventsUseCase {
  final SearchRepository _repository;

  SearchEventsUseCase(this._repository);

  Future<List<SearchResultEntity>> call(String query, {int limit = 15}) {
    return _repository.searchEvents(query, limit: limit);
  }
}
