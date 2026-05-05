# Jibble Mobile App

Flutter mobile client for the Jibble college social platform.

## Tech Stack
- Flutter 3.x / Dart 3
- Riverpod 2 (state management)
- GoRouter (navigation)
- Dio + Retrofit (HTTP)
- Socket.IO client (real-time)
- Firebase (push notifications)
- Hive + SharedPreferences (local storage)
- Clean Architecture (data / domain / presentation)

## Getting Started

```bash
flutter pub get
flutter run
```

## Architecture
Each feature follows the clean architecture pattern:
```
feature/
  data/
    datasources/    # API calls, local cache
    models/         # JSON serializable models
    repositories/   # implementations
  domain/
    entities/       # pure Dart classes
    repositories/   # abstract interfaces
    usecases/       # single-responsibility business logic
  presentation/
    provider/       # Riverpod providers
    screens/        # UI pages
    widgets/        # reusable widgets
```
