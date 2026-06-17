import '../repositories/auth_repository.dart';

/// Checks whether the device currently holds a valid auth session
/// (i.e., an access token is present in secure storage).
///
/// Used by [RouterNotifier] / auth gate to decide the initial route
/// before the full server verification completes.
class GetAuthStateChangesUseCase {
  final AuthRepository _repository;
  const GetAuthStateChangesUseCase(this._repository);

  /// Returns true if a stored access token exists.
  Future<bool> call() => _repository.hasValidSession();
}
