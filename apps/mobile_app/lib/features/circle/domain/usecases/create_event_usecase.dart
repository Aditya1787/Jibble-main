import '../entities/event_entity.dart';
import '../repositories/circle_repository.dart';

class CreateEventUseCase {
  final CircleRepository _repository;

  CreateEventUseCase(this._repository);

  Future<EventEntity> call(
    String circleId, {
    required String title,
    String? description,
    String? locationName,
    String? joinLink,
    required DateTime startsAt,
    required DateTime endsAt,
  }) {
    return _repository.createEvent(
      circleId,
      title: title,
      description: description,
      locationName: locationName,
      joinLink: joinLink,
      startsAt: startsAt,
      endsAt: endsAt,
    );
  }
}
