import '../entities/group_entity.dart';
import '../repositories/circle_repository.dart';

class CreateGroupUseCase {
  final CircleRepository _repository;

  CreateGroupUseCase(this._repository);

  Future<GroupEntity> call(
    String circleId, {
    required String name,
    String? description,
    String? iconName,
    bool isPrivate = false,
  }) {
    return _repository.createGroup(
      circleId,
      name: name,
      description: description,
      iconName: iconName,
      isPrivate: isPrivate,
    );
  }
}
