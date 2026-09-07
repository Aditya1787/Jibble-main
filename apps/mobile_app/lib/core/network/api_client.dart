import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'network_interceptor.dart';

/// Central Dio HTTP client for the Jibble app.
///
/// - [baseUrl] points to the backend `/api/v1` prefix.
/// - Injects [NetworkInterceptor] for auth tokens, 401 refresh, and logging.
class ApiClient {
  /// Production Render backend URL.
  static const String _baseUrl = 'https://jibble-main.onrender.com/api/v1';

  late final Dio _dio;

  ApiClient({required FlutterSecureStorage storage}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add the interceptor — pass the same Dio instance so refresh calls
    // do NOT re-trigger this interceptor (we check path inside).
    _dio.interceptors.add(
      NetworkInterceptor(storage: storage, dio: _dio),
    );
  }

  /// Raw Dio instance — use for direct request calls.
  Dio get dio => _dio;
}
