import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class ThemeToggleTile extends StatefulWidget {
  const ThemeToggleTile({super.key});

  @override
  State<ThemeToggleTile> createState() => _ThemeToggleTileState();
}

class _ThemeToggleTileState extends State<ThemeToggleTile> {
  bool _isDark = true;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primaryViolet.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.dark_mode, color: AppColors.primaryViolet, size: 20),
      ),
      title: const Text('Dark Mode', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
      subtitle: Text('Always on for deep OLED contrast', style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12)),
      trailing: Switch.adaptive(
        value: _isDark,
        activeTrackColor: AppColors.primaryViolet,
        onChanged: (val) => setState(() => _isDark = val),
      ),
    );
  }
}
