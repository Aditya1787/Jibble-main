import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import 'create_post_page.dart';
import '../../../story/presentation/screens/create_story_page.dart';
import '../../../reels/presentation/screens/create_reel_page.dart';

/// Creation Hub Shell featuring Instagram/TikTok style scrollable mode selector (POST | STORY | REEL).
class CreationHubShell extends StatefulWidget {
  final int initialPage;

  const CreationHubShell({super.key, this.initialPage = 0});

  @override
  State<CreationHubShell> createState() => _CreationHubShellState();
}

class _CreationHubShellState extends State<CreationHubShell> {
  late PageController _pageController;
  late int _currentPage;

  static const List<String> _modes = ['POST', 'STORY', 'REEL'];

  @override
  void initState() {
    super.initState();
    _currentPage = widget.initialPage;
    _pageController = PageController(initialPage: widget.initialPage);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onModeSelected(int index) {
    setState(() {
      _currentPage = index;
    });
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // PageView for switching creation modes
          PageView(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            children: const [
              CreatePostPage(),
              CreateStoryPage(),
              CreateReelPage(),
            ],
          ),

          // Bottom Instagram-Style Scrollable Mode Selector Dock
          Positioned(
            left: 0,
            right: 0,
            bottom: 24,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black38,
                      blurRadius: 10,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(_modes.length, (index) {
                    final isSelected = index == _currentPage;
                    return GestureDetector(
                      onTap: () => _onModeSelected(index),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        child: Text(
                          _modes[index],
                          style: TextStyle(
                            color: isSelected ? AppColors.accent : Colors.white60,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                            fontSize: 13,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
