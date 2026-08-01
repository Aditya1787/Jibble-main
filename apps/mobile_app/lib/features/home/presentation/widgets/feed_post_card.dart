import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../../../post/data/models/post_model.dart';

/// Breathtaking interactive Feed Post Card with Neumorphic buttons, double-tap heart pop, and #FE0101 like states.
class FeedPostCard extends StatefulWidget {
  final PostModel post;
  final VoidCallback onLikeTapped;
  final VoidCallback? onCommentTapped;
  final VoidCallback? onShareTapped;

  const FeedPostCard({
    super.key,
    required this.post,
    required this.onLikeTapped,
    this.onCommentTapped,
    this.onShareTapped,
  });

  @override
  State<FeedPostCard> createState() => _FeedPostCardState();
}

class _FeedPostCardState extends State<FeedPostCard> with SingleTickerProviderStateMixin {
  late bool _isLiked;
  late int _likesCount;
  bool _isFollowing = false;
  bool _isSaved = false;

  // Double-tap heart pop animation controller
  late AnimationController _heartAnimController;
  late Animation<double> _heartScale;
  late Animation<double> _heartOpacity;
  bool _showHeartOverlay = false;

  @override
  void initState() {
    super.initState();
    _isLiked = widget.post.isLiked;
    _likesCount = widget.post.likesCount;

    _heartAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _heartScale = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 0.0, end: 1.3), weight: 40),
      TweenSequenceItem(tween: Tween<double>(begin: 1.3, end: 1.0), weight: 30),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 0.0), weight: 30),
    ]).animate(_heartAnimController);

    _heartOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 0.0, end: 1.0), weight: 30),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 1.0), weight: 40),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 0.0), weight: 30),
    ]).animate(_heartAnimController);

    _heartAnimController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          _showHeartOverlay = false;
        });
      }
    });
  }

  @override
  void dispose() {
    _heartAnimController.dispose();
    super.dispose();
  }

  void _handleLikeToggle() {
    setState(() {
      _isLiked = !_isLiked;
      _likesCount += _isLiked ? 1 : -1;
    });
    widget.onLikeTapped();
  }

  void _triggerDoubleTapLike() {
    if (!_isLiked) {
      setState(() {
        _isLiked = true;
        _likesCount += 1;
      });
      widget.onLikeTapped();
    }

    setState(() {
      _showHeartOverlay = true;
    });
    _heartAnimController.forward(from: 0.0);
  }

  @override
  Widget build(BuildContext context) {
    final hasAuthor = widget.post.author != null;
    final displayName = hasAuthor ? widget.post.author!.displayName : 'Student User';
    final username = hasAuthor ? '@${widget.post.author!.username}' : '@anonymous';
    final avatarUrl = hasAuthor ? widget.post.author!.avatarUrl : null;
    final isVerified = hasAuthor ? widget.post.author!.isVerified : false;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x10000000),
            blurRadius: 16,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── 1. Header Row ─────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 10, 10),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 21,
                  backgroundColor: AppColors.accent.withValues(alpha: 0.15),
                  backgroundImage: avatarUrl != null ? CachedNetworkImageProvider(avatarUrl) : null,
                  child: avatarUrl == null
                      ? Text(
                          displayName.isNotEmpty ? displayName[0].toUpperCase() : 'U',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.accent),
                        )
                      : null,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              displayName,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                                fontSize: 14,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.verified_rounded,
                              size: 14,
                              color: AppColors.accent,
                            ),
                          ],
                        ],
                      ),
                      Text(
                        username,
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),

                // Neumorphic Follow Pill Button: Hidden if already following
                if (!_isFollowing) ...[
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _isFollowing = true;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        gradient: AppColors.accentGradient,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.accent.withValues(alpha: 0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.add_rounded, color: Colors.white, size: 14),
                          SizedBox(width: 3),
                          Text(
                            'Follow',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],

                // Neumorphic Settings / More Options Icon Button
                GestureDetector(
                  onTap: () {},
                  child: const NeumorphicBox(
                    shape: BoxShape.circle,
                    padding: EdgeInsets.all(8),
                    child: Icon(Icons.more_vert_rounded, color: AppColors.textSecondary, size: 18),
                  ),
                ),
              ],
            ),
          ),

          // ── 2. Post Media / Content with Double-Tap Heart ────────────
          GestureDetector(
            onDoubleTap: _triggerDoubleTapLike,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Media or Text Content Container
                if (widget.post.mediaUrls.isNotEmpty)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: CachedNetworkImage(
                      imageUrl: widget.post.mediaUrls.first,
                      width: double.infinity,
                      height: 320,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        height: 320,
                        color: AppColors.surface,
                        child: const Center(
                          child: CircularProgressIndicator(color: AppColors.accent),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        height: 200,
                        color: AppColors.surface,
                        child: const Center(
                          child: Icon(Icons.image_not_supported_rounded, color: AppColors.textMuted),
                        ),
                      ),
                    ),
                  )
                else if (widget.post.caption != null && widget.post.caption!.isNotEmpty)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      widget.post.caption!,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        height: 1.4,
                      ),
                    ),
                  ),

                // Heart Overlay Pop Animation
                if (_showHeartOverlay)
                  AnimatedBuilder(
                    animation: _heartAnimController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _heartOpacity.value,
                        child: Transform.scale(
                          scale: _heartScale.value,
                          child: const Icon(
                            Icons.favorite_rounded,
                            color: Color(0xFFFE0101),
                            size: 110,
                          ),
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),

          // ── 3. Caption below Media ──────────────────────────────────
          if (widget.post.mediaUrls.isNotEmpty && widget.post.caption != null && widget.post.caption!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 4),
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: '$displayName ',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 13,
                      ),
                    ),
                    TextSpan(
                      text: widget.post.caption!,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // ── 4. Neumorphic Interactive Action Buttons Bar ─────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
            child: Row(
              children: [
                // 1. Neumorphic Like Button (turns #FE0101 when liked)
                GestureDetector(
                  onTap: _handleLikeToggle,
                  child: NeumorphicBox(
                    borderRadius: 24,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    color: _isLiked ? const Color(0xFFFE0101).withValues(alpha: 0.12) : null,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          color: _isLiked ? const Color(0xFFFE0101) : AppColors.textSecondary,
                          size: 20,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '$_likesCount',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _isLiked ? const Color(0xFFFE0101) : AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // 2. Neumorphic Comment Button
                GestureDetector(
                  onTap: widget.onCommentTapped,
                  child: NeumorphicBox(
                    borderRadius: 24,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.chat_bubble_outline_rounded,
                          color: AppColors.textSecondary,
                          size: 19,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${widget.post.commentsCount}',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // 3. Neumorphic Share Button
                GestureDetector(
                  onTap: widget.onShareTapped,
                  child: const NeumorphicBox(
                    shape: BoxShape.circle,
                    padding: EdgeInsets.all(9),
                    child: Icon(
                      Icons.send_rounded,
                      color: AppColors.textSecondary,
                      size: 18,
                    ),
                  ),
                ),

                const Spacer(),

                // 4. Neumorphic Save / Bookmark Button
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isSaved = !_isSaved;
                    });
                  },
                  child: NeumorphicBox(
                    shape: BoxShape.circle,
                    padding: const EdgeInsets.all(9),
                    color: _isSaved ? AppColors.accent.withValues(alpha: 0.15) : null,
                    child: Icon(
                      _isSaved ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                      color: _isSaved ? AppColors.accent : AppColors.textSecondary,
                      size: 19,
                    ),
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
