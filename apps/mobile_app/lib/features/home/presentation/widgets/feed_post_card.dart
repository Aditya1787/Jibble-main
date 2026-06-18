import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../post/data/models/post_model.dart';

/// A card displaying a feed post with full metrics, media, and interactive states.
class FeedPostCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final hasAuthor = post.author != null;
    final displayName = hasAuthor ? post.author!.displayName : 'Anonymous';
    final username = hasAuthor ? '@${post.author!.username}' : 'stealth';
    final avatarUrl = hasAuthor ? post.author!.avatarUrl : null;
    final isVerified = hasAuthor ? post.author!.isVerified : false;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header Row ─────────────────────────────────────────────
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.surface,
                  backgroundImage: avatarUrl != null ? CachedNetworkImageProvider(avatarUrl) : null,
                  child: avatarUrl == null
                      ? const Icon(Icons.person_rounded, color: AppColors.textSecondary)
                      : null,
                ),
                const SizedBox(width: 12),
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
                              color: AppColors.success,
                            ),
                          ],
                          const SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              username,
                              style: const TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 13,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Text(
                            _formatTime(post.createdAt),
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.circle, size: 3, color: AppColors.textMuted),
                          const SizedBox(width: 6),
                          Icon(
                            _getVisibilityIcon(post.visibility),
                            size: 11,
                            color: AppColors.textMuted,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.more_horiz, color: AppColors.textMuted),
              ],
            ),
            const SizedBox(height: 12),

            // ── Caption text ───────────────────────────────────────────
            if (post.caption != null && post.caption!.isNotEmpty) ...[
              Text(
                post.caption!,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 12),
            ],

            // ── Link Preview (if link type) ─────────────────────────────
            if (post.type == 'link' && post.linkPreview != null) ...[
              _buildLinkPreview(post.linkPreview!, post.linkUrl),
              const SizedBox(height: 12),
            ],

            // ── Poll Options (if poll type) ─────────────────────────────
            if (post.type == 'poll' && post.pollOptions != null) ...[
              _buildPoll(post.pollOptions!),
              const SizedBox(height: 12),
            ],

            // ── Media elements (if image/video/carousel type) ───────────
            if (post.mediaUrls.isNotEmpty) ...[
              _buildMediaGrid(post.mediaUrls),
              const SizedBox(height: 16),
            ],

            // ── Action Buttons Row ──────────────────────────────────────
            Row(
              children: [
                _buildActionItem(
                  icon: post.isLiked ? Icons.favorite_rounded : Icons.favorite_outline_rounded,
                  iconColor: post.isLiked ? AppColors.danger : AppColors.textMuted,
                  label: post.likesCount.toString(),
                  onTap: onLikeTapped,
                ),
                const SizedBox(width: 28),
                _buildActionItem(
                  icon: Icons.chat_bubble_outline_rounded,
                  label: post.commentsCount.toString(),
                  onTap: onCommentTapped ?? () {},
                ),
                const SizedBox(width: 28),
                _buildActionItem(
                  icon: Icons.share_outlined,
                  label: 'Share',
                  onTap: onShareTapped ?? () {},
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ── Sub-Widget Builders ─────────────────────────────────────────────────────

  Widget _buildActionItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Color? iconColor,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(
            icon,
            size: 18,
            color: iconColor ?? AppColors.textMuted,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLinkPreview(LinkPreviewModel preview, String? url) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (preview.imageUrl != null)
            CachedNetworkImage(
              imageUrl: preview.imageUrl!,
              height: 150,
              width: double.infinity,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => const SizedBox.shrink(),
            ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (preview.title != null)
                  Text(
                    preview.title!,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                      fontSize: 13,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                if (preview.description != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    preview.description!,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 12,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                if (url != null) ...[
                  const SizedBox(height: 6),
                  Text(
                    Uri.parse(url).host,
                    style: const TextStyle(
                      color: AppColors.accentLight,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPoll(List<PollOptionModel> options) {
    final totalVotes = options.fold<int>(0, (sum, item) => sum + item.votes);

    return Column(
      children: options.map((opt) {
        final percent = totalVotes > 0 ? (opt.votes / totalVotes) : 0.0;
        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Container(
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border, width: 1),
            ),
            child: Stack(
              children: [
                // Vote Percentage Progress Bar Background
                FractionallySizedBox(
                  widthFactor: percent,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(7),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        opt.text,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        '${(percent * 100).toStringAsFixed(0)}%',
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMediaGrid(List<String> urls) {
    if (urls.length == 1) {
      return Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: CachedNetworkImage(
            imageUrl: urls[0],
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: AppColors.surface),
            errorWidget: (_, __, ___) => const Icon(Icons.broken_image),
          ),
        ),
      );
    }

    // Grid layout for multiple images
    return SizedBox(
      height: 200,
      child: GridView.builder(
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: urls.length.clamp(1, 4),
        itemBuilder: (context, index) {
          return Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border, width: 1),
            ),
            clipBehavior: Clip.antiAlias,
            child: CachedNetworkImage(
              imageUrl: urls[index],
              fit: BoxFit.cover,
              placeholder: (_, __) => Container(color: AppColors.surface),
              errorWidget: (_, __, ___) => const Icon(Icons.broken_image),
            ),
          );
        },
      ),
    );
  }

  IconData _getVisibilityIcon(String visibility) {
    switch (visibility) {
      case 'private':
        return Icons.lock_outline_rounded;
      case 'followers':
        return Icons.people_outline_rounded;
      case 'college_only':
        return Icons.school_outlined;
      default:
        return Icons.public_rounded;
    }
  }

  String _formatTime(String isoString) {
    try {
      final date = DateTime.parse(isoString);
      final diff = DateTime.now().difference(date);

      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 7) return '${diff.inDays}d ago';
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return 'just now';
    }
  }
}
