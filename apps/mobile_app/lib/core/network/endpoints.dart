/// All API endpoint path constants for the Jibble mobile app.
/// Base URL is configured in [ApiClient]. These are relative paths
/// appended to `/api/v1`.
library;

class Endpoints {
  Endpoints._(); // non-instantiable

  // ── Auth ────────────────────────────────────────────────────────────────────
  static const String authSignup    = '/auth/signup';
  static const String authLogin     = '/auth/login';
  static const String authRefresh   = '/auth/refresh';
  static const String authLogout    = '/auth/logout';
  static const String authMe        = '/auth/me';
  static const String creatorMode   = '/auth/creator-mode';

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
  static const String postFeed     = '/posts/feed';
  static String postById(String id) => '/posts/$id';
  static String postLike(String id) => '/posts/$id/like';
  static String userPosts(String username) => '/posts/user/$username';

  // ── Stories ─────────────────────────────────────────────────────────────────
  static const String stories     = '/stories';
  static const String storyFeed   = '/stories/feed';
  static String userStories(String userId) => '/stories/user/$userId';
  static String viewStory(String id) => '/stories/$id/view';

  // ── Circles ─────────────────────────────────────────────────────────────────
  static const String circles = '/circles';
  static String circleById(String id) => '/circles/$id';
  static String circleHome(String id) => '/circles/$id/home';
  static String circleEvents(String id) => '/circles/$id/events';
  static String circleAnonymousPosts(String id) => '/circles/$id/anonymous-posts';
  static String circleGroups(String id) => '/circles/$id/groups';

  // ── Follow ──────────────────────────────────────────────────────────────────
  static String follow(String userId)     => '/follow/$userId';
  static String unfollow(String userId)   => '/follow/$userId';
  static String isFollowing(String userId) => '/follow/check/$userId';
  static String followers(String userId)  => '/follow/followers/$userId';
  static String following(String userId)  => '/follow/following/$userId';

  // ── Notifications ────────────────────────────────────────────────────────────
  static const String notifications           = '/notifications';
  static const String notificationsUnread     = '/notifications/unread-count';
  static const String notificationsMarkAll    = '/notifications/read-all';
  static String notificationMarkRead(String id) => '/notifications/$id/read';

  // ── Search ──────────────────────────────────────────────────────────────────
  static const String search = '/search';

  // ── Chat ────────────────────────────────────────────────────────────────────
  static const String chatConversations = '/chat/conversations';
  static String chatMessages(String recipientId) => '/chat/messages/$recipientId';
  static const String chatSend = '/chat/messages';

  // ── Upload ──────────────────────────────────────────────────────────────────
  static const String uploadPresign = '/uploads/presign';
}
