import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Data class representing a Reel post
class ReelItem {
  final String id;
  final String username;
  final String userAvatar;
  final String caption;
  final String songTitle;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final Color bgGradientStart;
  final Color bgGradientEnd;
  final String videoConcept;
  bool isLiked;
  bool isFollowing;

  ReelItem({
    required this.id,
    required this.username,
    required this.userAvatar,
    required this.caption,
    required this.songTitle,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.bgGradientStart,
    required this.bgGradientEnd,
    required this.videoConcept,
    this.isLiked = false,
    this.isFollowing = false,
  });
}

/// World-class interactive Reels Page with vertical swipe, double-tap hearts, and bottom sheets.
class ReelsPage extends StatefulWidget {
  const ReelsPage({super.key});

  @override
  State<ReelsPage> createState() => _ReelsPageState();
}

class _ReelsPageState extends State<ReelsPage> with TickerProviderStateMixin {
  late PageController _pageController;
  late AnimationController _heartAnimController;
  late Animation<double> _heartScaleAnimation;

  int _currentIndex = 0;
  bool _isMuted = false;
  bool _showHeartOverlay = false;
  Offset _heartTapPosition = Offset.zero;

  final List<ReelItem> _reels = [
    ReelItem(
      id: '1',
      username: 'alex_dev',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      caption: 'Late night coding vibes at the library! Building the future of campus connection 🚀 #Jibble #CampusLife #Flutter',
      songTitle: 'Original Audio - alex_dev • Synthwave Night',
      likesCount: 14200,
      commentsCount: 842,
      sharesCount: 312,
      bgGradientStart: const Color(0xFF1F493D),
      bgGradientEnd: const Color(0xFF0F0F1A),
      videoConcept: '💻 Mobile App Design System Walkthrough',
      isLiked: true,
      isFollowing: true,
    ),
    ReelItem(
      id: '2',
      username: 'sarah_design',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      caption: 'UI/UX Glassmorphism animation breakdown! What do you think of these neon gradients? ✨ #UIUX #DesignSystem',
      songTitle: 'Chill Beats - LoFi Chill Hop 2026',
      likesCount: 9850,
      commentsCount: 419,
      sharesCount: 180,
      bgGradientStart: const Color(0xFF336659),
      bgGradientEnd: const Color(0xFF1E1E2C),
      videoConcept: '🎨 UI Micro-interactions Showcase',
    ),
    ReelItem(
      id: '3',
      username: 'campus_events',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      caption: 'Annual Hackathon kickoff! 48 hours of pure creation starts NOW 🎉🔥 #Hackathon2026 #JibbleCommunity',
      songTitle: 'High Energy - Electronic Hype Beats',
      likesCount: 22400,
      commentsCount: 1290,
      sharesCount: 850,
      bgGradientStart: const Color(0xFF487C6F),
      bgGradientEnd: const Color(0xFF12121E),
      videoConcept: '⚡ Hackathon Live Countdown & Demo',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _heartAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _heartScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.4).chain(CurveTween(curve: Curves.elasticOut)), weight: 60),
      TweenSequenceItem(tween: Tween(begin: 1.4, end: 0.0).chain(CurveTween(curve: Curves.easeIn)), weight: 40),
    ]).animate(_heartAnimController);
  }

  @override
  void dispose() {
    _pageController.dispose();
    _heartAnimController.dispose();
    super.dispose();
  }

  void _triggerDoubleTapHeart(TapDownDetails details, ReelItem reel) {
    setState(() {
      if (!reel.isLiked) {
        reel.isLiked = true;
      }
      _heartTapPosition = details.localPosition;
      _showHeartOverlay = true;
    });

    _heartAnimController.forward(from: 0.0).then((_) {
      if (mounted) {
        setState(() {
          _showHeartOverlay = false;
        });
      }
    });
  }

  void _showCommentsModal(BuildContext context, ReelItem reel) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.65,
        decoration: const BoxDecoration(
          color: Color(0xFF1E1E2C),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${reel.commentsCount} Comments',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),
            const Divider(color: Colors.white10, height: 1),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: 4,
                itemBuilder: (ctx, i) {
                  final comments = [
                    {'name': 'elena_r', 'text': 'This UI is amazingly smooth! 🔥', 'time': '2h'},
                    {'name': 'marcus_code', 'text': 'Can’t wait for the official launch!', 'time': '4h'},
                    {'name': 'dev_guru', 'text': 'What library are you using for animations?', 'time': '5h'},
                    {'name': 'nora_k', 'text': 'Super crisp design! Loved the gradients!', 'time': '1d'},
                  ];
                  final item = comments[i];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 18,
                          backgroundColor: AppColors.accent,
                          child: Text(item['name']![0].toUpperCase(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(item['name']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                                  const SizedBox(width: 8),
                                  Text(item['time']!, style: const TextStyle(color: Colors.white38, fontSize: 11)),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(item['text']!, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.favorite_border_rounded, size: 16, color: Colors.white38),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Container(
              padding: EdgeInsets.only(
                left: 16,
                right: 16,
                top: 12,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              decoration: const BoxDecoration(
                color: Color(0xFF141422),
                border: Border(top: BorderSide(color: Colors.white10)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 16,
                    backgroundColor: AppColors.accentLight,
                    child: Icon(Icons.person, size: 20, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Add a comment...',
                        hintStyle: const TextStyle(color: Colors.white38),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide.none,
                        ),
                        fillColor: Colors.white10,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.send_rounded, color: AppColors.accentLight),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showShareModal(BuildContext context, ReelItem reel) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Color(0xFF1E1E2C),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Share Reel',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildShareOption(Icons.link_rounded, 'Copy Link', Colors.teal, () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Reel link copied to clipboard!')),
                  );
                }),
                _buildShareOption(Icons.send_rounded, 'Direct Chat', Colors.blue, () {
                  Navigator.pop(ctx);
                }),
                _buildShareOption(Icons.camera_rounded, 'Add to Story', Colors.purple, () {
                  Navigator.pop(ctx);
                }),
                _buildShareOption(Icons.more_horiz_rounded, 'More', Colors.orange, () {
                  Navigator.pop(ctx);
                }),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: PageView.builder(
        controller: _pageController,
        scrollDirection: Axis.vertical,
        itemCount: _reels.length,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        itemBuilder: (context, index) {
          final reel = _reels[index];
          return GestureDetector(
            onDoubleTapDown: (details) => _triggerDoubleTapHeart(details, reel),
            child: Stack(
              children: [
                // Simulated High-Quality Video Container
                AnimatedContainer(
                  duration: const Duration(milliseconds: 500),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [reel.bgGradientStart, reel.bgGradientEnd],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(28),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white24, width: 2),
                          ),
                          child: Icon(
                            _isMuted ? Icons.volume_off_rounded : Icons.play_arrow_rounded,
                            size: 64,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          reel.videoConcept,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Colors.greenAccent,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'LIVE HD PLAYBACK',
                              style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 1),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Top Header Overlay (Camera & Audio Toggle)
                Positioned(
                  top: 50,
                  left: 16,
                  right: 16,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Reels • ${_currentIndex + 1}/${_reels.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: Icon(_isMuted ? Icons.volume_off_rounded : Icons.volume_up_rounded, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _isMuted = !_isMuted;
                              });
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.camera_alt_rounded, color: Colors.white),
                            onPressed: () {
                              Navigator.pushNamed(context, '/create-reel');
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Double Tap Animated Heart Overlay
                if (_showHeartOverlay)
                  Positioned(
                    left: _heartTapPosition.dx - 50,
                    top: _heartTapPosition.dy - 50,
                    child: AnimatedBuilder(
                      animation: _heartScaleAnimation,
                      builder: (ctx, child) {
                        return Transform.scale(
                          scale: _heartScaleAnimation.value,
                          child: const Icon(
                            Icons.favorite_rounded,
                            size: 100,
                            color: Color(0xFFFE0101),
                          ),
                        );
                      },
                    ),
                  ),

                // Gradient Vignette overlay for text contrast
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 250,
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.transparent, Colors.black87, Colors.black],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ),

                // Right Action Sidebar
                Positioned(
                  right: 16,
                  bottom: 50,
                  child: Column(
                    children: [
                      _buildReelAction(
                        icon: reel.isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                        label: '${(reel.likesCount + (reel.isLiked ? 1 : 0))}',
                        color: reel.isLiked ? const Color(0xFFFE0101) : Colors.white,
                        onTap: () {
                          setState(() {
                            reel.isLiked = !reel.isLiked;
                          });
                        },
                      ),
                      const SizedBox(height: 22),
                      _buildReelAction(
                        icon: Icons.chat_bubble_rounded,
                        label: '${reel.commentsCount}',
                        color: Colors.white,
                        onTap: () => _showCommentsModal(context, reel),
                      ),
                      const SizedBox(height: 22),
                      _buildReelAction(
                        icon: Icons.send_rounded,
                        label: '${reel.sharesCount}',
                        color: Colors.white,
                        onTap: () => _showShareModal(context, reel),
                      ),
                      const SizedBox(height: 22),
                      _buildReelAction(
                        icon: Icons.more_vert_rounded,
                        label: '',
                        color: Colors.white,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),

                // Bottom Reel User Info & Caption
                Positioned(
                  left: 16,
                  bottom: 30,
                  right: 90,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundImage: NetworkImage(reel.userAvatar),
                            backgroundColor: AppColors.accent,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            '@${reel.username}',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          const SizedBox(width: 12),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                reel.isFollowing = !reel.isFollowing;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                              decoration: BoxDecoration(
                                color: reel.isFollowing ? Colors.white12 : AppColors.accent,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: reel.isFollowing ? Colors.white54 : Colors.transparent),
                              ),
                              child: Text(
                                reel.isFollowing ? 'Following' : 'Follow',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        reel.caption,
                        style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.3),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Icon(Icons.music_note_rounded, color: Colors.white70, size: 14),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              reel.songTitle,
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildReelAction({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.black26,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 28, color: color),
          ),
          if (label.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        ],
      ),
    );
  }
}
