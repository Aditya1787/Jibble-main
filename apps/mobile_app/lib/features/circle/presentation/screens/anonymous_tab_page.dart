import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/anonymous_post_model.dart';

class AnonymousTabPage extends StatefulWidget {
  final String circleId;

  const AnonymousTabPage({
    super.key,
    required this.circleId,
  });

  @override
  State<AnonymousTabPage> createState() => _AnonymousTabPageState();
}

class _AnonymousTabPageState extends State<AnonymousTabPage> {
  final List<AnonymousPostModel> _posts = [
    const AnonymousPostModel(
      id: 'anon-1',
      caption: 'Honestly, the computer vision final project is 10x harder than advertised. Anyone studying late in the library?',
      anonymousAlias: 'Anonymous Owl',
      likesCount: 34,
      commentsCount: 9,
      createdAt: '2 hours ago',
      isLiked: false,
    ),
    const AnonymousPostModel(
      id: 'anon-2',
      caption: 'Big shoutout to whoever left the extra charger in lab 402! You saved my thesis presentation today.',
      anonymousAlias: 'Silver Falcon',
      likesCount: 52,
      commentsCount: 14,
      createdAt: '5 hours ago',
      isLiked: true,
    ),
  ];

  void _openCreateAnonymousDialog() {
    final textController = TextEditingController();
    String selectedAlias = 'Anonymous Lynx';
    final aliases = ['Anonymous Lynx', 'Curious Owl', 'Shadow Falcon', 'Mystic Panther', 'Silent Wolf'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            top: 24,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Color(0xFF161622),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.shield_outlined, color: AppColors.accentLight, size: 22),
                        SizedBox(width: 8),
                        Text(
                          'Anonymous Confession',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Your profile and real name are hidden from all community members. Post freely and respectfully.',
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
                const SizedBox(height: 16),
                const Text('Choose Identity Alias:', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: aliases.map((alias) {
                      final isSelected = alias == selectedAlias;
                      return GestureDetector(
                        onTap: () => setModalState(() => selectedAlias = alias),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.accent : Colors.white10,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            alias,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected ? Colors.white : Colors.white70,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: textController,
                  maxLines: 4,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Share your thoughts anonymously...',
                    hintStyle: const TextStyle(color: Colors.white38),
                    filled: true,
                    fillColor: const Color(0xFF222034),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (textController.text.trim().isEmpty) return;
                      final newPost = AnonymousPostModel(
                        id: 'anon-${DateTime.now().millisecondsSinceEpoch}',
                        caption: textController.text.trim(),
                        anonymousAlias: selectedAlias,
                        likesCount: 0,
                        commentsCount: 0,
                        createdAt: 'Just now',
                      );
                      setState(() {
                        _posts.insert(0, newPost);
                      });
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Anonymous post shared in circle feed! 🕵️')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Publish Anonymously', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openCreateAnonymousDialog,
        backgroundColor: const Color(0xFF7C4DFF),
        icon: const Icon(Icons.lock_person_rounded, color: Colors.white),
        label: const Text('Confess / Post Anon', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _posts.length,
        itemBuilder: (context, index) {
          final post = _posts[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            color: const Color(0xFF1E1C2E),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
              side: const BorderSide(color: Colors.white12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF7C4DFF).withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.masks_rounded, color: Color(0xFFB388FF), size: 20),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post.anonymousAlias,
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
                          ),
                          Text(
                            post.createdAt,
                            style: const TextStyle(color: Colors.white38, fontSize: 11),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'ANONYMOUS',
                          style: TextStyle(fontSize: 10, letterSpacing: 0.8, color: Colors.white70, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    post.caption,
                    style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            final isLiked = !post.isLiked;
                            _posts[index] = post.copyWith(
                              isLiked: isLiked,
                              likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
                            );
                          });
                        },
                        child: Row(
                          children: [
                            Icon(
                              post.isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                              color: post.isLiked ? Colors.redAccent : Colors.white54,
                              size: 18,
                            ),
                            const SizedBox(width: 4),
                            Text('${post.likesCount}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 18),
                      Row(
                        children: [
                          const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white54, size: 18),
                          const SizedBox(width: 4),
                          Text('${post.commentsCount}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
