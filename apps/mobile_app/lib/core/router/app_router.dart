import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

import '../../features/auth/presentation/provider/auth_provider.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/login_page.dart';
import '../../features/auth/presentation/screens/register_page.dart';
import '../../features/auth/presentation/screens/otp_verification_page.dart';
import '../../features/auth/presentation/screens/onboarding/college_page.dart';
import '../../features/home/presentation/screens/main_shell.dart';

// ── Route path constants ───────────────────────────────────────────────────────

class Routes {
  Routes._();

  static const splash     = '/';
  static const login      = '/login';
  static const register   = '/register';
  static const otp        = '/otp';
  static const onboarding = '/onboarding';
  static const home       = '/home';
}

// ── RouterNotifier ────────────────────────────────────────────────────────────

/// A [ChangeNotifier] that bridges Riverpod auth state into GoRouter's
/// [refreshListenable]. Whenever auth status changes, GoRouter re-evaluates
/// the [redirect] callback automatically.
class RouterNotifier extends ChangeNotifier {
  final Ref _ref;

  RouterNotifier(this._ref) {
    // Listen to auth state changes and notify GoRouter to re-check redirect
    _ref.listen<AuthState>(
      authProvider,
      (_, __) => notifyListeners(),
    );
  }

  /// Redirect logic called by GoRouter on every navigation event.
  String? redirect(BuildContext context, GoRouterState state) {
    final authState = _ref.read(authProvider);
    final status = authState.status;
    final loc = state.matchedLocation;

    // 1. Still booting — keep or redirect to splash
    if (status == AuthStatus.initial) {
      return loc == Routes.splash ? null : Routes.splash;
    }

    // 2. Unauthenticated — force to login if not already on an auth page
    if (status == AuthStatus.unauthenticated || status == AuthStatus.error) {
      final isAuthPage = loc == Routes.login ||
          loc == Routes.register ||
          loc == Routes.otp;
      if (!isAuthPage) {
        return Routes.login;
      }
      return null;
    }

    // 3. Authenticated — force to onboarding or home
    if (status == AuthStatus.authenticated) {
      if (authState.needsOnboarding) {
        final isOnboardingOrOtp = loc == Routes.onboarding || loc == Routes.otp;
        if (!isOnboardingOrOtp) {
          return Routes.onboarding;
        }
        return null;
      }

      final isAuthOrSplashPage = loc == Routes.login ||
          loc == Routes.register ||
          loc == Routes.otp ||
          loc == Routes.splash ||
          loc == Routes.onboarding;
      if (isAuthOrSplashPage) {
        return Routes.home;
      }
      return null;
    }

    return null; // no redirect needed
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

final routerNotifierProvider = ChangeNotifierProvider<RouterNotifier>((ref) {
  return RouterNotifier(ref);
});

final appRouterProvider = Provider<GoRouter>((ref) {
  final notifier = ref.watch(routerNotifierProvider);

  return GoRouter(
    initialLocation: Routes.splash,
    refreshListenable: notifier,
    redirect: notifier.redirect,
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: Routes.splash,
        name: 'splash',
        pageBuilder: (context, state) => const NoTransitionPage(
          child: SplashScreen(),
        ),
      ),
      GoRoute(
        path: Routes.login,
        name: 'login',
        pageBuilder: (context, state) => const MaterialPage(
          child: LoginPage(),
        ),
      ),
      GoRoute(
        path: Routes.register,
        name: 'register',
        pageBuilder: (context, state) => const MaterialPage(
          child: RegisterPage(),
        ),
      ),
      GoRoute(
        path: Routes.otp,
        name: 'otp',
        pageBuilder: (context, state) {
          final email = state.uri.queryParameters['email'] ?? '';
          return MaterialPage(child: OtpVerificationPage(email: email));
        },
      ),
      GoRoute(
        path: Routes.onboarding,
        name: 'onboarding',
        pageBuilder: (context, state) => const MaterialPage(
          child: CollegePage(),
        ),
      ),
      GoRoute(
        path: Routes.home,
        name: 'home',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainShell(),
        ),
      ),
    ],
  );
});
