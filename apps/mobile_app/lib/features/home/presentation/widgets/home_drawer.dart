import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/provider/auth_provider.dart';

/// Navigation Drawer sliding from the left-side of the HomePage.
/// Displays user profile info (profile pic, display name, username) and platform features.
class HomeDrawer extends ConsumerWidget {
  const HomeDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    
    // Fallbacks if user details are not fully loaded
    final email = user?.email ?? 'student@jibble.edu';
    final fallbackUsername = '@${email.split('@')[0]}';
    final fallbackName = email.split('@')[0].toUpperCase();

    return Drawer(
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // ── Drawer Header ───────────────────────────────────────────
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(
              color: AppColors.background,
              border: Border(
                bottom: BorderSide(color: AppColors.border, width: 1),
              ),
            ),
            currentAccountPicture: CircleAvatar(
              radius: 36,
              backgroundColor: AppColors.accent.withOpacity(0.15),
              child: Text(
                fallbackName.isNotEmpty ? fallbackName[0] : 'J',
                style: const TextStyle(
                  color: AppColors.accentLight,
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            accountName: Text(
              fallbackName,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.textPrimary,
              ),
            ),
            accountEmail: Text(
              fallbackUsername,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 13,
              ),
            ),
          ),

          // ── Drawer Menu Items ──────────────────────────────────────
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _buildDrawerTile(
                  icon: Icons.person_outline_rounded,
                  title: 'My Profile',
                  onTap: () {
                    Navigator.pop(context); // Close drawer
                    // Later: Navigate to profile
                  },
                ),
                _buildDrawerTile(
                  icon: Icons.bookmark_border_rounded,
                  title: 'Bookmarks / Saved',
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                _buildDrawerTile(
                  icon: Icons.bar_chart_rounded,
                  title: 'Analytics Insights',
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                _buildDrawerTile(
                  icon: Icons.settings_outlined,
                  title: 'Settings',
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                const Divider(color: AppColors.border, height: 24, thickness: 1),
                _buildDrawerTile(
                  icon: Icons.logout_rounded,
                  title: 'Log Out',
                  iconColor: AppColors.danger,
                  textColor: AppColors.danger,
                  onTap: () {
                    Navigator.pop(context);
                    ref.read(authProvider.notifier).logout();
                  },
                ),
              ],
            ),
          ),
          
          // ── Bottom Footer / Version Info ───────────────────────────
          const Padding(
            padding: EdgeInsets.only(bottom: 24),
            child: Text(
              'Jibble v0.1.0',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 11,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color? iconColor,
    Color? textColor,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: iconColor ?? AppColors.textSecondary,
        size: 22,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: textColor ?? AppColors.textPrimary,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      onTap: onTap,
      dense: true,
      visualDensity: const VisualDensity(vertical: -1),
    );
  }
}
