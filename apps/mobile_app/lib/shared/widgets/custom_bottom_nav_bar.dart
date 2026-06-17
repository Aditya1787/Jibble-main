import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// The persistent bottom navigation bar used across the main app shell.
/// Tabs: Home | Circles | Create | Chat | Profile
///
/// Will be wired to GoRouter shell routes in the navigation sprint.
class CustomBottomNavBar extends StatelessWidget {
  final int    currentIndex;
  final void Function(int) onTap;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  static const _items = [
    _NavItem(icon: Icons.home_outlined,    activeIcon: Icons.home_rounded,        label: 'Home'),
    _NavItem(icon: Icons.groups_outlined,  activeIcon: Icons.groups_rounded,      label: 'Circles'),
    _NavItem(icon: Icons.add_circle_outline, activeIcon: Icons.add_circle_rounded, label: 'Create'),
    _NavItem(icon: Icons.chat_bubble_outline, activeIcon: Icons.chat_bubble_rounded, label: 'Chat'),
    _NavItem(icon: Icons.person_outline,   activeIcon: Icons.person_rounded,      label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color:  AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.border, width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color:      Colors.black.withOpacity(0.25),
            blurRadius: 12,
            offset:     const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            children: List.generate(_items.length, (i) {
              final item      = _items[i];
              final isActive  = i == currentIndex;
              final isCreate  = i == 2; // centre Create tab

              return Expanded(
                child: InkWell(
                  onTap:         () => onTap(i),
                  splashColor:   AppColors.accent.withOpacity(0.08),
                  highlightColor: Colors.transparent,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (isCreate)
                        // Floating create button style
                        Container(
                          width:  44,
                          height: 36,
                          decoration: BoxDecoration(
                            gradient: AppColors.accentGradient,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color:      AppColors.accent.withOpacity(0.4),
                                blurRadius: 10,
                                offset:     const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.add_rounded,
                            color: Colors.white,
                            size:  22,
                          ),
                        )
                      else
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 200),
                          child: Icon(
                            isActive ? item.activeIcon : item.icon,
                            key:   ValueKey(isActive),
                            size:  24,
                            color: isActive
                                ? AppColors.accent
                                : AppColors.textMuted,
                          ),
                        ),
                      if (!isCreate) ...[
                        const SizedBox(height: 3),
                        AnimatedDefaultTextStyle(
                          duration: const Duration(milliseconds: 200),
                          style: TextStyle(
                            fontSize:   10,
                            fontWeight: isActive
                                ? FontWeight.w700
                                : FontWeight.w400,
                            color: isActive
                                ? AppColors.accent
                                : AppColors.textMuted,
                          ),
                          child: Text(item.label),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String   label;
  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
