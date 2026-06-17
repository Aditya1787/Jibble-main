/// All API endpoint path constants for the Jibble mobile app.
/// Base URL is configured in [ApiClient]. These are relative paths
/// appended to `/api/v1`.
library;

class Endpoints {
  Endpoints._(); // non-instantiable

  // ── Auth ────────────────────────────────────────────────────────────────────
  static const String authSignup  = '/auth/signup';
  static const String authLogin   = '/auth/login';
  static const String authRefresh = '/auth/refresh';
  static const String authLogout  = '/auth/logout';
  static const String authMe      = '/auth/me';

  // ── Users ───────────────────────────────────────────────────────────────────
  static const String users = '/users';
  static String userById(String id) => '/users/$id';

  // ── Profiles ────────────────────────────────────────────────────────────────
  static const String profileMe     = '/profiles/me';
  static const String profileCreate = '/profiles';
  static String profileByUsername(String username) => '/profiles/$username';
  static String profileUsernameCheck(String username) =>
      '/profiles/check-username/$username';

  // ── Colleges ────────────────────────────────────────────────────────────────
  static const String colleges = '/colleges';
  static String collegeById(String id) => '/colleges/$id';

  // ── Posts ───────────────────────────────────────────────────────────────────
  static const String posts        = '/posts';
  static String postById(String id) => '/posts/$id';
  static String postLike(String id) => '/posts/$id/like';

  // ── Stories ─────────────────────────────────────────────────────────────────
  static const String stories = '/stories';

  // ── Circles ─────────────────────────────────────────────────────────────────
  static const String circles = '/circles';
  static String circleById(String id) => '/circles/$id';

  // ── Follow ──────────────────────────────────────────────────────────────────
  static String follow(String userId)   => '/users/$userId/follow';
  static String unfollow(String userId) => '/users/$userId/follow';
  static String followers(String userId) => '/users/$userId/followers';
  static String following(String userId) => '/users/$userId/following';

  // ── Notifications ────────────────────────────────────────────────────────────
  static const String notifications    = '/notifications';
  static const String notificationsMark = '/notifications/mark-all-read';

  // ── Search ──────────────────────────────────────────────────────────────────
  static const String search = '/search';

  // ── Chat ────────────────────────────────────────────────────────────────────
  static const String chatRooms   = '/chats';
  static String chatMessages(String roomId) => '/chats/$roomId/messages';

  // ── Upload ──────────────────────────────────────────────────────────────────
  static const String uploadPresign = '/uploads/presign';
}
