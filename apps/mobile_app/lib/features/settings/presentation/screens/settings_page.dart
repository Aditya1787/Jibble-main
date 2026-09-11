import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/provider/auth_provider.dart';
import '../widgets/theme_toggle_tile.dart';

class SettingsPage extends ConsumerStatefulWidget {
  const SettingsPage({super.key});

  @override
  ConsumerState<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends ConsumerState<SettingsPage> {
  bool _hideLikesGlobal = false;
  bool _privateAccount = false;
  bool _isSwitchingRole = false;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;
    final isCreator = user?.isCreator ?? false;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: const Text('Settings & Privacy', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Role & Creator Switch Section
          _buildSectionHeader('ACCOUNT & ROLE'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primaryViolet.withValues(alpha: 0.25),
                  AppColors.neonCyan.withValues(alpha: 0.12),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.primaryViolet.withValues(alpha: 0.3)),
            ),
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primaryViolet.withValues(alpha: 0.3),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isCreator ? Icons.verified : Icons.person_outline,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isCreator ? 'Content Creator Account' : 'Normal Member Account',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isCreator
                            ? 'You can host Circles, publish targeted Circle posts, and configure advanced privacy.'
                            : 'Upgrade to Creator Mode anytime without re-registering or losing followers.',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: ElevatedButton.icon(
              onPressed: _isSwitchingRole
                  ? null
                  : () async {
                      final messenger = ScaffoldMessenger.of(context);
                      setState(() => _isSwitchingRole = true);
                      try {
                        final newEnableState = !isCreator;
                        await ref.read(authNotifierProvider.notifier).setCreatorMode(newEnableState);
                        messenger.showSnackBar(
                          SnackBar(
                            content: Text(newEnableState
                                ? '🎉 Welcome to Creator Mode! You can now manage Circles and publish to specific destinations.'
                                : 'Switched back to Normal User mode.'),
                            backgroundColor: AppColors.primaryViolet,
                          ),
                        );
                      } catch (e) {
                        messenger.showSnackBar(
                          SnackBar(content: Text('Failed to switch mode: $e'), backgroundColor: Colors.redAccent),
                        );
                      } finally {
                        if (mounted) setState(() => _isSwitchingRole = false);
                      }
                    },
              icon: _isSwitchingRole
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Icon(isCreator ? Icons.swap_horiz : Icons.stars, color: Colors.white),
              label: Text(
                isCreator ? 'Switch to Normal User Mode' : 'Upgrade to Content Creator Mode',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: isCreator ? Colors.white.withValues(alpha: 0.12) : AppColors.primaryViolet,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),

          const SizedBox(height: 16),
          _buildSectionHeader('CONTENT CREATOR PRIVACY CONTROLS'),
          SwitchListTile.adaptive(
            value: _hideLikesGlobal,
            activeTrackColor: AppColors.primaryViolet,
            onChanged: (val) => setState(() => _hideLikesGlobal = val),
            title: const Text('Hide Like & View Counts Globally', style: TextStyle(color: Colors.white, fontSize: 15)),
            subtitle: Text(
              'Only you will see total likes and views on your posts and reels.',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12),
            ),
          ),
          SwitchListTile.adaptive(
            value: _privateAccount,
            activeTrackColor: AppColors.primaryViolet,
            onChanged: (val) => setState(() => _privateAccount = val),
            title: const Text('Private Account', style: TextStyle(color: Colors.white, fontSize: 15)),
            subtitle: Text(
              'Only people you approve can see your photos and videos.',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12),
            ),
          ),

          const SizedBox(height: 16),
          _buildSectionHeader('PREFERENCES'),
          const ThemeToggleTile(),

          ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.notifications_none, color: Colors.amber, size: 20),
            ),
            title: const Text('Push Notifications', style: TextStyle(color: Colors.white, fontSize: 15)),
            trailing: const Icon(Icons.chevron_right, color: Colors.white38),
            onTap: () {},
          ),

          ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.redAccent.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.block, color: Colors.redAccent, size: 20),
            ),
            title: const Text('Blocked Accounts', style: TextStyle(color: Colors.white, fontSize: 15)),
            trailing: const Icon(Icons.chevron_right, color: Colors.white38),
            onTap: () {},
          ),

          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: OutlinedButton(
              onPressed: () async {
                final navigator = Navigator.of(context);
                await ref.read(authNotifierProvider.notifier).logout();
                navigator.pushNamedAndRemoveUntil('/login', (route) => false);
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.redAccent),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('Log Out', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text(
        title,
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.4),
          fontWeight: FontWeight.bold,
          fontSize: 12,
          letterSpacing: 1.1,
        ),
      ),
    );
  }
}
