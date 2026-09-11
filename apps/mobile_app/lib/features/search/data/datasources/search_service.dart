import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/search_result_model.dart';

class SearchService {
  final ApiClient _client;

  SearchService({required ApiClient client}) : _client = client;

  Future<List<SearchResultModel>> search(String query, {String type = 'all', int limit = 15}) async {
    final response = await _client.dio.get(
      Endpoints.search,
      queryParameters: {'q': query, 'type': type, 'limit': limit},
    );

    final data = response.data['data'] as Map<String, dynamic>? ?? {};
    final results = <SearchResultModel>[];

    if (data['users'] != null) {
      for (final item in data['users'] as List<dynamic>) {
        results.add(SearchResultModel.fromJson(item as Map<String, dynamic>, 'user'));
      }
    }
    if (data['circles'] != null) {
      for (final item in data['circles'] as List<dynamic>) {
        results.add(SearchResultModel.fromJson(item as Map<String, dynamic>, 'circle'));
      }
    }
    if (data['events'] != null) {
      for (final item in data['events'] as List<dynamic>) {
        results.add(SearchResultModel.fromJson(item as Map<String, dynamic>, 'event'));
      }
    }
    if (data['groups'] != null) {
      for (final item in data['groups'] as List<dynamic>) {
        results.add(SearchResultModel.fromJson(item as Map<String, dynamic>, 'group'));
      }
    }

    return results;
  }
}
