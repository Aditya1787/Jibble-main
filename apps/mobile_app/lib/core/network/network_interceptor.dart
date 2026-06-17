import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:logger/logger.dart';

import 'endpoints.dart';

/// Dio interceptor that:
/// 1. Attaches the Bearer access token to every outgoing request.
/// 2. On 401, attempts a silent token refresh and retries the original request.
/// 3. Logs all requests, responses, and errors for debugging.
class NetworkInterceptor extends Interceptor {
  final FlutterSecureStorage _storage;
  final Dio _dio;
  final Logger _log = Logger(
    printer: PrettyPrinter(methodCount: 0, noBoxingByDefault: true),
  );

  // Guard against infinite refresh loops
  bool _isRefreshing = false;

  NetworkInterceptor({
    required FlutterSecureStorage storage,
    required Dio dio,
  })  : _storage = storage,
        _dio = dio;

  // ── Request ────────────────────────────────────────────────────────────────

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.read(key: 'access_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    _log.d(
      '→ ${options.method} ${options.uri}'
      '${options.data != null ? '\n  body: ${options.data}' : ''}',
    );

    handler.next(options);
  }

  // ── Response ───────────────────────────────────────────────────────────────

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _log.d(
      '← ${response.statusCode} ${response.requestOptions.uri}',
    );
    handler.next(response);
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final statusCode = err.response?.statusCode;
    final requestPath = err.requestOptions.path;

    _log.e(
      '✗ $statusCode ${err.requestOptions.method} ${err.requestOptions.uri}'
      '\n  ${err.message}',
    );

    // Attempt silent token refresh on 401, except for auth endpoints
    if (statusCode == 401 &&
        !_isRefreshing &&
        requestPath != Endpoints.authRefresh &&
        requestPath != Endpoints.authLogin) {
      _isRefreshing = true;

      try {
        final refreshToken = await _storage.read(key: 'refresh_token');
        if (refreshToken == null) {
          // No refresh token available — clear storage and pass error along
          await _clearTokens();
          _isRefreshing = false;
          handler.next(err);
          return;
        }

        // Call refresh endpoint
        final refreshResponse = await _dio.post(
          Endpoints.authRefresh,
          data: {'refreshToken': refreshToken},
        );

        final newAccessToken =
            refreshResponse.data['data']['accessToken'] as String?;

        if (newAccessToken == null) {
          await _clearTokens();
          _isRefreshing = false;
          handler.next(err);
          return;
        }

        // Persist new token
        await _storage.write(key: 'access_token', value: newAccessToken);

        // Retry the original request with the new token
        final retryOptions = err.requestOptions;
        retryOptions.headers['Authorization'] = 'Bearer $newAccessToken';

        final retryResponse = await _dio.fetch(retryOptions);
        _isRefreshing = false;
        handler.resolve(retryResponse);
        return;
      } catch (_) {
        await _clearTokens();
        _isRefreshing = false;
      }
    }

    handler.next(err);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  Future<void> _clearTokens() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
  }
}
