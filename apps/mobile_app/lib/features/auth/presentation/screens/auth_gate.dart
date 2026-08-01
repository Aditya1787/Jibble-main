import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/router/app_router.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import '../provider/auth_provider.dart';

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<AuthState>(authProvider, (_, next) {
      if (next.status == AuthStatus.unauthenticated ||
          next.status == AuthStatus.error) {
        context.go(Routes.login);
      }
    });

    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: NeumorphicBox(
            borderRadius: 28,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Avatar plate
                NeumorphicBox(
                  shape: BoxShape.circle,
                  padding: const EdgeInsets.all(12),
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.accent,
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Welcome text
                const Text(
                  'Welcome to Jibble! 🎉',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppColors.accentDark,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                if (user?.email.isNotEmpty == true)
                  Text(
                    user!.email,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                const SizedBox(height: 32),

                // Status card inside recessed plate
                const NeumorphicBox(
                  isRecessed: true,
                  borderRadius: 18,
                  padding: EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Icon(Icons.check_circle_outline_rounded,
                            color: AppColors.accent,
                            size: 22),
                        SizedBox(width: 8),
                        Text('Authentication Active!',
                            style: TextStyle(
                              color: AppColors.accentDark,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            )),
                      ]),
                      SizedBox(height: 10),
                      Text(
                        'Your profile setup is complete. The full home feed and campus portals will load in the next sprint.',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          height: 1.4,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 36),

                // Logout Button
                GestureDetector(
                  onTap: () => ref.read(authProvider.notifier).logout(),
                  child: const NeumorphicBox(
                    color: AppColors.danger,
                    padding: EdgeInsets.symmetric(vertical: 16),
                    borderRadius: 16,
                    child: Center(
                      child: Text(
                        'Logout',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          letterSpacing: 0.5,
                        ),
                      ),
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
