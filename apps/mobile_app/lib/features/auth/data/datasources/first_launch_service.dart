import 'package:shared_preferences/shared_preferences.dart';

/// Tracks whether the user has launched the app before.
///
/// Used to decide whether to show the onboarding walkthrough screens
/// or jump straight to the auth gate / login.
class FirstLaunchService {
  static const _key = 'jibble_first_launch_done';

  /// Returns [true] if this is the very first time the app has been opened.
  static Future<bool> isFirstLaunch() async {
    final prefs = await SharedPreferences.getInstance();
    return !(prefs.getBool(_key) ?? false);
  }

  /// Call after the user has completed (or skipped) onboarding.
  static Future<void> markLaunched() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_key, true);
  }

  /// Reset for testing or "show onboarding again" flows.
  static Future<void> reset() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
