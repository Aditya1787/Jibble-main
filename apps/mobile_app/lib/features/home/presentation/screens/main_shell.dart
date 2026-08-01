import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import 'home_page.dart';
import '../../../circle/presentation/screens/circle_page.dart';
import '../../../reels/presentation/screens/reels_page.dart';
import '../../../chat/presentation/screens/chat_list_page.dart';
import '../../../post/presentation/screens/creation_hub_shell.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    HomePage(),
    CirclePage(),
    Scaffold(), // Placeholder for Create Post tab modal
    ReelsPage(),
    ChatListPage(),
  ];

  void _onTabTapped(int index) {
    if (index == 2) {
      // Create Post opens as a full Creation Hub modal screen
      Navigator.push(context, MaterialPageRoute(builder: (_) => const CreationHubShell()));
      return;
    }
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 0, 14, 10),
          child: NeumorphicBox(
            borderRadius: 30,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                // 1. Home Tab
                _AnimatedBottomBarTab(
                  index: 0,
                  isSelected: _currentIndex == 0,
                  label: 'Home',
                  activeIcon: Icons.home_rounded,
                  inactiveIcon: Icons.home_outlined,
                  onTap: () => _onTabTapped(0),
                ),

                // 2. CIRCLE Tab (Flagship Highlighted Feature!)
                _AnimatedBottomBarTab(
                  index: 1,
                  isSelected: _currentIndex == 1,
                  label: 'Circle',
                  isCircleFeature: true,
                  activeIcon: Icons.bubble_chart_rounded,
                  inactiveIcon: Icons.bubble_chart_outlined,
                  onTap: () => _onTabTapped(1),
                ),

                // 3. Create Post Tab (Center Action FAB)
                _AnimatedBottomBarTab(
                  index: 2,
                  isSelected: false,
                  label: 'Create',
                  isCreateButton: true,
                  activeIcon: Icons.add_rounded,
                  inactiveIcon: Icons.add_rounded,
                  onTap: () => _onTabTapped(2),
                ),

                // 4. Reels Tab
                _AnimatedBottomBarTab(
                  index: 3,
                  isSelected: _currentIndex == 3,
                  label: 'Reels',
                  activeIcon: Icons.video_library_rounded,
                  inactiveIcon: Icons.video_library_outlined,
                  onTap: () => _onTabTapped(3),
                ),

                // 5. Chat Tab
                _AnimatedBottomBarTab(
                  index: 4,
                  isSelected: _currentIndex == 4,
                  label: 'Chat',
                  activeIcon: Icons.chat_bubble_rounded,
                  inactiveIcon: Icons.chat_bubble_outline_rounded,
                  onTap: () => _onTabTapped(4),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Interactive Animated Bottom Bar Tab with elastic growing & pulling physics on hold.
class _AnimatedBottomBarTab extends StatefulWidget {
  final int index;
  final bool isSelected;
  final String label;
  final IconData activeIcon;
  final IconData inactiveIcon;
  final VoidCallback onTap;
  final bool isCircleFeature;
  final bool isCreateButton;

  const _AnimatedBottomBarTab({
    required this.index,
    required this.isSelected,
    required this.label,
    required this.activeIcon,
    required this.inactiveIcon,
    required this.onTap,
    this.isCircleFeature = false,
    this.isCreateButton = false,
  });

  @override
  State<_AnimatedBottomBarTab> createState() => _AnimatedBottomBarTabState();
}

class _AnimatedBottomBarTabState extends State<_AnimatedBottomBarTab> {
  bool _isHeld = false;

  @override
  Widget build(BuildContext context) {
    // Dynamic scale physics: when held, grows big (1.28x) with vertical elastic stretch (pulled feel)
    final double scaleX = _isHeld ? 1.15 : (widget.isSelected ? 1.08 : 1.0);
    final double scaleY = _isHeld ? 1.32 : (widget.isSelected ? 1.08 : 1.0);
    final double translateY = _isHeld ? -6.0 : (widget.isSelected ? -2.0 : 0.0);

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) {
        setState(() {
          _isHeld = true;
        });
        widget.onTap(); // Instant responsive tab trigger
      },
      onTapUp: (_) {
        setState(() {
          _isHeld = false;
        });
      },
      onTapCancel: () {
        setState(() {
          _isHeld = false;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutBack,
        transform: Matrix4.identity()
          ..translateByDouble(0.0, translateY, 0.0, 1.0)
          ..scaleByDouble(scaleX, scaleY, 0.0, 1.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.isCreateButton)
              // Center 3D Neumorphic FAB Create Button
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: AppColors.accentGradient,
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.accent.withValues(alpha: _isHeld ? 0.6 : 0.4),
                      blurRadius: _isHeld ? 14 : 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Icon(
                  widget.activeIcon,
                  color: Colors.white,
                  size: 22,
                ),
              )
            else if (widget.isCircleFeature)
              // CIRCLE FLAGSHIP FEATURE BUTTON: Vibrant Neumorphic Halo Plate
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: widget.isSelected || _isHeld ? AppColors.accentGradient : null,
                  color: widget.isSelected || _isHeld ? null : AppColors.accent.withValues(alpha: 0.12),
                  boxShadow: (widget.isSelected || _isHeld)
                      ? [
                          BoxShadow(
                            color: AppColors.accent.withValues(alpha: 0.45),
                            blurRadius: 12,
                            spreadRadius: 1,
                            offset: const Offset(0, 3),
                          ),
                        ]
                      : null,
                ),
                child: Icon(
                  widget.isSelected || _isHeld ? widget.activeIcon : widget.inactiveIcon,
                  color: widget.isSelected || _isHeld ? Colors.white : AppColors.accent,
                  size: 22,
                ),
              )
            else
              // Standard Tab Icons with Neumorphic subtle indicator
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.isSelected ? AppColors.accent.withValues(alpha: 0.12) : Colors.transparent,
                ),
                child: Icon(
                  widget.isSelected ? widget.activeIcon : widget.inactiveIcon,
                  color: widget.isSelected ? AppColors.accent : AppColors.textMuted,
                  size: 22,
                ),
              ),

            const SizedBox(height: 3),

            // Tab Label Text
            Text(
              widget.label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: widget.isSelected || _isHeld || widget.isCircleFeature
                    ? FontWeight.bold
                    : FontWeight.w500,
                color: widget.isCircleFeature
                    ? AppColors.accent
                    : (widget.isSelected ? AppColors.accent : AppColors.textMuted),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
