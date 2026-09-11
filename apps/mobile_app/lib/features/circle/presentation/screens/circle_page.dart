import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import 'circle_home_page.dart';
import 'events_tab_page.dart';
import 'anonymous_tab_page.dart';
import 'groups_tab_page.dart';
import '../widgets/create_community_modal.dart';

/// Circle 5-Navigation Hub Shell.
/// Provides the 5 flagship destinations:
/// 1. ← Home (Return to Jibble Main Shell)
/// 2. Circle Home (Corner ellipse active members & central feed)
/// 3. Events (Event cards with redirect join links)
/// 4. Anonymous (Identity-protected confession stream)
/// 5. Groups (Sub-groups and group chats)
class CirclePage extends StatefulWidget {
  final String circleId;
  final String circleName;
  final VoidCallback? onReturnHome;

  const CirclePage({
    super.key,
    this.circleId = 'circle-default',
    this.circleName = 'LPU CSE Community',
    this.onReturnHome,
  });

  @override
  State<CirclePage> createState() => _CirclePageState();
}

class _CirclePageState extends State<CirclePage> {
  int _activeCircleTabIndex = 0; // 0: Circle Home, 1: Events, 2: Anonymous, 3: Groups

  void _navigateToTab(int index) {
    setState(() {
      _activeCircleTabIndex = index;
    });
  }

  void _openCircleStatsModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Color(0xFF1B1B2A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${widget.circleName} Analytics',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white54),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatBadge('1,420', 'Members'),
                _buildStatBadge('342', 'Active Today'),
                _buildStatBadge('86', 'Events Held'),
                _buildStatBadge('12', 'Sub-Groups'),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildStatBadge(String count, String label) {
    return Column(
      children: [
        Text(count, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.accentLight)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.white60)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: const Color(0xFF161622),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          tooltip: 'Return to Jibble Home',
          onPressed: () {
            if (widget.onReturnHome != null) {
              widget.onReturnHome!();
            } else if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
          },
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.accent.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.bubble_chart_rounded, color: AppColors.accentLight, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.circleName,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Text(
                    '1.4k members • Official Community',
                    style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart_rounded, color: Colors.white70),
            tooltip: 'Circle Statistics',
            onPressed: _openCircleStatsModal,
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.accent),
            tooltip: 'Create Community',
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (_) => const CreateCommunityModal(),
              );
            },
          ),
        ],
      ),

      // Body switches across the 4 internal Circle views
      body: IndexedStack(
        index: _activeCircleTabIndex,
        children: [
          CircleHomePage(
            circleId: widget.circleId,
            circleName: widget.circleName,
            onGoToEvents: () => _navigateToTab(1),
            onGoToAnonymous: () => _navigateToTab(2),
            onGoToGroups: () => _navigateToTab(3),
          ),
          EventsTabPage(circleId: widget.circleId),
          AnonymousTabPage(circleId: widget.circleId),
          GroupsTabPage(circleId: widget.circleId),
        ],
      ),

      // 5-Way Circle Dock Navigation
      bottomNavigationBar: SafeArea(
        child: Container(
          margin: const EdgeInsets.fromLTRB(14, 0, 14, 10),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF1B1B2A),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Colors.white10),
            boxShadow: const [
              BoxShadow(color: Colors.black45, blurRadius: 12, offset: Offset(0, 4)),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              // 1. Navigation 1: ← Home
              _CircleDockItem(
                label: 'Home',
                icon: Icons.arrow_back_rounded,
                isSelected: false,
                isExitButton: true,
                onTap: () {
                  if (widget.onReturnHome != null) {
                    widget.onReturnHome!();
                  } else if (Navigator.canPop(context)) {
                    Navigator.pop(context);
                  }
                },
              ),

              // 2. Navigation 2: Circle Main
              _CircleDockItem(
                label: 'Circle',
                icon: Icons.bubble_chart_rounded,
                isSelected: _activeCircleTabIndex == 0,
                onTap: () => _navigateToTab(0),
              ),

              // 3. Navigation 3: Events
              _CircleDockItem(
                label: 'Events',
                icon: Icons.event_available_rounded,
                isSelected: _activeCircleTabIndex == 1,
                onTap: () => _navigateToTab(1),
              ),

              // 4. Navigation 4: Anonymous
              _CircleDockItem(
                label: 'Anon',
                icon: Icons.masks_rounded,
                isSelected: _activeCircleTabIndex == 2,
                onTap: () => _navigateToTab(2),
              ),

              // 5. Navigation 5: Groups
              _CircleDockItem(
                label: 'Groups',
                icon: Icons.forum_rounded,
                isSelected: _activeCircleTabIndex == 3,
                onTap: () => _navigateToTab(3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CircleDockItem extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final bool isExitButton;
  final VoidCallback onTap;

  const _CircleDockItem({
    required this.label,
    required this.icon,
    required this.isSelected,
    this.isExitButton = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.accent.withValues(alpha: 0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isExitButton
                  ? Colors.white70
                  : (isSelected ? AppColors.accent : Colors.white54),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isExitButton
                    ? Colors.white70
                    : (isSelected ? AppColors.accent : Colors.white54),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
