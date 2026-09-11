import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/post_model.dart';

class PostCardWidget extends StatelessWidget {
  final PostModel post;
  final VoidCallback? onLike;
  final VoidCallback? onComment;
  final VoidCallback? onTap;

  const PostCardWidget({
    super.key,
    required this.post,
    this.onLike,
    this.onComment,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final author = post.author;
    final authorName = author?.displayName ?? 'Jibble Member';
    final authorUsername = author?.username ?? 'user';
    final hasMetricsHidden = post.likesCount < 0;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.2),
                    backgroundImage: author?.avatarUrl != null ? NetworkImage(author!.avatarUrl!) : null,
                    child: author?.avatarUrl == null
                        ? Text(
                            authorName.isNotEmpty ? authorName[0].toUpperCase() : '?',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          )
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
                                authorName,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (author?.isVerified == true) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.verified, color: AppColors.primaryViolet, size: 16),
                            ],
                          ],
                        ),
                        Text(
                          '@$authorUsername',
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.more_horiz, color: Colors.white.withValues(alpha: 0.6)),
                    onPressed: () {},
                  ),
                ],
              ),

              // Caption
              if (post.caption != null && post.caption!.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(
                  post.caption!,
                  style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.4),
                ),
              ],

              // Media
              if (post.mediaUrls.isNotEmpty) ...[
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      post.mediaUrls.first,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: Colors.white.withValues(alpha: 0.05),
                        child: const Center(
                          child: Icon(Icons.broken_image, color: Colors.white30),
                        ),
                      ),
                    ),
                  ),
                ),
              ],

              // Actions Footer
              const SizedBox(height: 14),
              Row(
                children: [
                  // Like
                  InkWell(
                    onTap: onLike,
                    borderRadius: BorderRadius.circular(20),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            post.isLiked ? Icons.favorite : Icons.favorite_border,
                            color: post.isLiked ? Colors.redAccent : Colors.white70,
                            size: 20,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            hasMetricsHidden ? 'Likes' : '${post.likesCount}',
                            style: const TextStyle(color: Colors.white70, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),

                  // Comment
                  InkWell(
                    onTap: onComment,
                    borderRadius: BorderRadius.circular(20),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.chat_bubble_outline, color: Colors.white70, size: 19),
                          const SizedBox(width: 6),
                          Text(
                            post.commentsCount < 0 ? 'Off' : '${post.commentsCount}',
                            style: const TextStyle(color: Colors.white70, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Spacer(),

                  // Share
                  IconButton(
                    icon: const Icon(Icons.share_outlined, color: Colors.white70, size: 19),
                    onPressed: () {},
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
