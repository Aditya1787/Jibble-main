import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Splash screen shown while [AuthNotifier.checkAuth] runs.
///
/// Once auth state settles (authenticated → /home, unauthenticated → /login)
/// GoRouter's redirect logic handles navigation automatically.
/// This widget just displays the branding animation.
class SplashScreen extends ConsumerWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // ── Lottie animation ─────────────────────────────────────────
            Lottie.asset(
              'assets/Lottie Animations/Handshake Loop.json',
              width: 220,
              height: 220,
              fit: BoxFit.contain,
              repeat: true,
            ),
            const SizedBox(height: 28),

            // ── Logo text ────────────────────────────────────────────────
            Text(
              'Jibble',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontFamily: 'Dancing_Script',
                    fontSize: 52,
                    fontWeight: FontWeight.w700,
                    color: Theme.of(context).colorScheme.primary,
                    letterSpacing: 1.5,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Your Campus, Your Vibe',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    letterSpacing: 1.3,
                    color: Colors.grey[500],
                  ),
            ),
            const SizedBox(height: 48),

            // ── Loading indicator ────────────────────────────────────────
            SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Theme.of(context).colorScheme.primary.withOpacity(0.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
