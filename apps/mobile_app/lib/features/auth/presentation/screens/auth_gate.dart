import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/app_router.dart';
import '../provider/auth_provider.dart';

/// Auth gate — the home placeholder shown at [Routes.home].
///
/// If somehow auth is lost while on this screen, listen and redirect via GoRouter.
/// Full BottomNavigationBar shell will replace this in a later sprint.
class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // The RouterNotifier already handles redirecting away from /home
    // when unauthenticated. This listener is a safety net for edge cases.
    ref.listen<AuthState>(authProvider, (_, next) {
      if (next.status == AuthStatus.unauthenticated ||
          next.status == AuthStatus.error) {
        context.go(Routes.login);
      }
    });

    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // ── Avatar ─────────────────────────────────────────────
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(context).colorScheme.secondary,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Theme.of(context)
                            .colorScheme
                            .primary
                            .withOpacity(0.35),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.person_rounded,
                    size: 44,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 24),

                // ── Welcome text ───────────────────────────────────────
                Text(
                  'Welcome to Jibble! 🎉',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                if (user?.email.isNotEmpty == true)
                  Text(
                    user!.email,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Colors.grey[400],
                        ),
                  ),
                const SizedBox(height: 40),

                // ── Status card ────────────────────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Theme.of(context)
                          .colorScheme
                          .primary
                          .withOpacity(0.25),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Icon(Icons.check_circle_outline_rounded,
                            color: Theme.of(context).colorScheme.primary,
                            size: 20),
                        const SizedBox(width: 8),
                        Text('Auth is working!',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(
                                  color:
                                      Theme.of(context).colorScheme.primary,
                                )),
                      ]),
                      const SizedBox(height: 8),
                      Text(
                        'Full home feed, navigation shell, and profile '
                        'will be built in the next sprint.',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // ── Logout ─────────────────────────────────────────────
                OutlinedButton.icon(
                  onPressed: () =>
                      ref.read(authProvider.notifier).logout(),
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text('Logout'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
