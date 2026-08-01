import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildRipple(double delayFraction) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        double progress = _controller.value + delayFraction;
        if (progress > 1.0) progress -= 1.0;

        final scale = 0.8 + (progress * 1.6);
        final opacity = (1.0 - progress).clamp(0.0, 1.0);

        return Opacity(
          opacity: opacity,
          child: Transform.scale(
            scale: scale,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.background,
                boxShadow: [
                  BoxShadow(
                    color: Colors.white.withOpacity(0.9),
                    offset: const Offset(-6, -6),
                    blurRadius: 10,
                  ),
                  BoxShadow(
                    color: const Color(0xFFD2CDC3).withOpacity(0.8),
                    offset: const Offset(6, 6),
                    blurRadius: 10,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Centered Ripples and Center Circle
          Align(
            alignment: Alignment.center,
            child: Stack(
              alignment: Alignment.center,
              children: [
                _buildRipple(0.0),
                _buildRipple(0.33),
                _buildRipple(0.66),

                // Pulsating logo plate
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    final pulse = 1.0 + math.sin(_controller.value * 2 * math.pi) * 0.04;

                    return Transform.scale(
                      scale: pulse,
                      child: Container(
                        width: 130,
                        height: 130,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.background,
                          boxShadow: [
                            const BoxShadow(
                              color: Colors.white,
                              offset: Offset(-5, -5),
                              blurRadius: 12,
                            ),
                            BoxShadow(
                              color: const Color(0xFFD2CDC3).withOpacity(0.7),
                              offset: const Offset(5, 5),
                              blurRadius: 12,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'J',
                            style: TextStyle(
                              fontFamily: 'Dancing_Script',
                              fontSize: 58,
                              fontWeight: FontWeight.w800,
                              color: AppColors.accent,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          // Branding positioned cleanly at the bottom of the screen
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Jibble',
                  style: TextStyle(
                    fontFamily: 'Dancing_Script',
                    fontSize: 48,
                    fontWeight: FontWeight.w800,
                    color: AppColors.accentDark,
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Your Campus, Your Vibe',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textSecondary,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
