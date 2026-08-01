import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../../../auth/presentation/provider/auth_provider.dart';

/// Neumorphic Navigation Drawer sliding from the left-side of the HomePage.
class HomeDrawer extends ConsumerWidget {
  const HomeDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    final email = user?.email ?? 'student@jibble.edu';
    final fallbackUsername = '@${email.split('@')[0]}';
    final fallbackName = email.split('@')[0].toUpperCase();

    return Drawer(
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            // ── Drawer Header ───────────────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
              decoration: const BoxDecoration(
                color: AppColors.background,
                border: Border(
                  bottom: BorderSide(color: AppColors.border, width: 1),
                ),
              ),
              child: Column(
                children: [
                  NeumorphicBox(
                    shape: BoxShape.circle,
                    padding: const EdgeInsets.all(4),
                    child: CircleAvatar(
                      radius: 38,
                      backgroundColor: AppColors.accent.withValues(alpha: 0.15),
                      child: Text(
                        fallbackName.isNotEmpty ? fallbackName[0] : 'J',
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    fallbackUsername,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),

            // ── Drawer Menu Items ──────────────────────────────────────
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                children: [
                  _buildNeumorphicTile(
                    icon: Icons.settings_outlined,
                    title: 'Settings',
                    onTap: () => Navigator.pop(context),
                  ),
                  const SizedBox(height: 12),
                  _buildNeumorphicTile(
                    icon: Icons.workspace_premium_outlined,
                    title: 'Pricing',
                    onTap: () => Navigator.pop(context),
                  ),
                  const SizedBox(height: 12),
                  _buildNeumorphicTile(
                    icon: Icons.category_outlined,
                    title: 'Category',
                    onTap: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // ── Bottom Neumorphic Logout Button ───────────────────────
            Padding(
              padding: const EdgeInsets.all(16),
              child: GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                  ref.read(authProvider.notifier).logout();
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.danger.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.danger.withValues(alpha: 0.3), width: 1.2),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.logout_rounded, color: AppColors.danger, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Log Out',
                        style: TextStyle(
                          color: AppColors.danger,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNeumorphicTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: NeumorphicBox(
        borderRadius: 16,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.accent.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.accent, size: 20),
            ),
            const SizedBox(width: 14),
            Text(
              title,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 18),
          ],
        ),
      ),
    );
  }
}
