import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../../../auth/presentation/provider/auth_provider.dart';
import '../../../home/presentation/provider/feed_provider.dart';
import '../../data/models/post_model.dart';
import 'media_editor_page.dart';

/// Rich X/Instagram style Post Creation Screen with multi-photo carousel, filters, and metadata.
class CreatePostPage extends ConsumerStatefulWidget {
  const CreatePostPage({super.key});

  @override
  ConsumerState<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends ConsumerState<CreatePostPage> {
  final TextEditingController _captionController = TextEditingController();
  String _selectedVisibility = 'public';
  String _targetDestination = 'global_feed'; // 'global_feed' or 'circle_only'
  String _selectedCircleName = 'CSE Community';
  bool _hideLikesAndViews = false;
  bool _hideComments = false;
  String? _selectedLocation;
  String? _selectedMusic;
  final List<String> _mediaUrls = [];
  String _activeFilterName = 'Normal';

  // Sample media URLs for gallery pick demo
  static const List<String> _sampleGalleryImages = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
  ];

  @override
  void dispose() {
    _captionController.dispose();
    super.dispose();
  }

  void _addPhoto() {
    if (_mediaUrls.length < _sampleGalleryImages.length) {
      setState(() {
        _mediaUrls.add(_sampleGalleryImages[_mediaUrls.length]);
      });
    }
  }

  void _removePhoto(int index) {
    setState(() {
      _mediaUrls.removeAt(index);
    });
  }

  void _openFilterEditor(String imagePath) async {
    final resultFilter = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (_) => MediaEditorPage(imagePath: imagePath),
      ),
    );
    if (resultFilter != null) {
      setState(() {
        _activeFilterName = resultFilter;
      });
    }
  }

  void _submitPost() {
    final text = _captionController.text.trim();
    if (text.isEmpty && _mediaUrls.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add text or photos to post.')),
      );
      return;
    }

    final user = ref.read(authProvider).user;
    final authorModel = AuthorModel(
      username: user?.email.split('@')[0] ?? 'creator',
      displayName: user?.email.split('@')[0].toUpperCase() ?? 'CREATOR',
      avatarUrl: null,
      isVerified: true,
    );

    final newPost = PostModel(
      id: const Uuid().v4(),
      userId: user?.id ?? 'mock-user-123',
      collegeId: 'college-uuid-1',
      type: _mediaUrls.isNotEmpty ? 'image' : 'text',
      visibility: _selectedVisibility,
      caption: text,
      mediaUrls: _mediaUrls,
      thumbnailUrl: _mediaUrls.isNotEmpty ? _mediaUrls.first : null,
      linkUrl: null,
      linkPreview: null,
      pollOptions: null,
      pollEndsAt: null,
      location: _selectedLocation,
      hashtags: ['JibbleCommunity', _targetDestination == 'circle_only' ? _selectedCircleName : 'Global'],
      mentions: [],
      isPinned: false,
      isArchived: false,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: DateTime.now().toIso8601String(),
      updatedAt: DateTime.now().toIso8601String(),
      author: authorModel,
      isLiked: false,
    );

    // Optimistically prepend new post into feedProvider state
    ref.read(feedProvider.notifier).addOptimisticPost(newPost);

    final message = _targetDestination == 'circle_only'
        ? 'Post shared exclusively to $_selectedCircleName! 🎯'
        : 'Post published to Global Jibble Feed! 🚀';

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final displayName = user?.email.split('@')[0].toUpperCase() ?? 'STUDENT';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: AppColors.textPrimary, size: 24),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Create Post', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12, top: 10, bottom: 10),
            child: GestureDetector(
              onTap: _submitPost,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                decoration: BoxDecoration(
                  gradient: AppColors.accentGradient,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.accent.withValues(alpha: 0.3),
                      blurRadius: 6,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'Post',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Publishing Destination Toggle Bar
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1B1B2A),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _targetDestination = 'global_feed'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: _targetDestination == 'global_feed' ? AppColors.accent : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Center(
                                child: Text(
                                  '🌐 Main Jibble',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: _targetDestination == 'global_feed' ? Colors.white : Colors.white60,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _targetDestination = 'circle_only'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: _targetDestination == 'circle_only' ? AppColors.accent : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Center(
                                child: Text(
                                  '🎯 Post to Circle',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: _targetDestination == 'circle_only' ? Colors.white : Colors.white60,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  if (_targetDestination == 'circle_only') ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.bubble_chart_rounded, color: AppColors.accent, size: 18),
                          const SizedBox(width: 8),
                          const Text('Target Circle: ', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedCircleName,
                              dropdownColor: AppColors.surface,
                              style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 12),
                              items: const [
                                DropdownMenuItem(value: 'CSE Community', child: Text('CSE Community')),
                                DropdownMenuItem(value: 'Flutter Developers', child: Text('Flutter Developers')),
                                DropdownMenuItem(value: 'Design Hub', child: Text('Design Hub')),
                              ],
                              onChanged: (val) {
                                if (val != null) setState(() => _selectedCircleName = val);
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 16),

                  // User Avatar + Audience Selector
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: AppColors.accent.withValues(alpha: 0.15),
                        child: Text(
                          displayName.isNotEmpty ? displayName[0] : 'S',
                          style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            displayName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedVisibility,
                                isDense: true,
                                icon: const Icon(Icons.arrow_drop_down, color: AppColors.accent, size: 18),
                                items: const [
                                  DropdownMenuItem(value: 'public', child: Text('🌐 Everyone', style: TextStyle(fontSize: 11, color: AppColors.textPrimary))),
                                  DropdownMenuItem(value: 'followers', child: Text('🔒 Followers Only', style: TextStyle(fontSize: 11, color: AppColors.textPrimary))),
                                  DropdownMenuItem(value: 'friends', child: Text('👥 Friends Only', style: TextStyle(fontSize: 11, color: AppColors.textPrimary))),
                                  DropdownMenuItem(value: 'private', child: Text('🔒 Only Me', style: TextStyle(fontSize: 11, color: AppColors.textPrimary))),
                                ],
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedVisibility = val);
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Neumorphic Text Composer Input Card
                  NeumorphicBox(
                    isRecessed: true,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    borderRadius: 20,
                    child: TextField(
                      controller: _captionController,
                      maxLines: null,
                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 16, height: 1.35),
                      decoration: const InputDecoration(
                        hintText: 'What is happening in your community?',
                        hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 15),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Privacy & Interaction Settings Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Creator Privacy Controls',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary),
                        ),
                        SwitchListTile.adaptive(
                          dense: true,
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Only I can see views & likes', style: TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                          subtitle: const Text('Hide public like and view counts', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                          value: _hideLikesAndViews,
                          activeTrackColor: AppColors.accent,
                          onChanged: (val) => setState(() => _hideLikesAndViews = val),
                        ),
                        const Divider(height: 1, color: Colors.white10),
                        SwitchListTile.adaptive(
                          dense: true,
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Hide / disable comments', style: TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                          subtitle: const Text('Turn off commenting for this post', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                          value: _hideComments,
                          activeTrackColor: AppColors.accent,
                          onChanged: (val) => setState(() => _hideComments = val),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Active Metadata Tags Chips (Location, Music, Filter)
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      if (_selectedLocation != null)
                        Chip(
                          avatar: const Icon(Icons.location_on, size: 16, color: AppColors.accent),
                          label: Text(_selectedLocation!, style: const TextStyle(fontSize: 12)),
                          onDeleted: () => setState(() => _selectedLocation = null),
                        ),
                      if (_selectedMusic != null)
                        Chip(
                          avatar: const Icon(Icons.music_note, size: 16, color: AppColors.accent),
                          label: Text(_selectedMusic!, style: const TextStyle(fontSize: 12)),
                          onDeleted: () => setState(() => _selectedMusic = null),
                        ),
                      if (_activeFilterName != 'Normal')
                        Chip(
                          avatar: const Icon(Icons.auto_awesome, size: 16, color: AppColors.accent),
                          label: Text('Filter: $_activeFilterName', style: const TextStyle(fontSize: 12)),
                          onDeleted: () => setState(() => _activeFilterName = 'Normal'),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Instagram Style Multiple Photo Carousel Gallery Preview
                  if (_mediaUrls.isNotEmpty) ...[
                    const Text('Attached Photos:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textSecondary)),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 140,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _mediaUrls.length,
                        itemBuilder: (context, index) {
                          final url = _mediaUrls[index];
                          return Padding(
                            padding: const EdgeInsets.only(right: 12),
                            child: Stack(
                              children: [
                                GestureDetector(
                                  onTap: () => _openFilterEditor(url),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: CachedNetworkImage(
                                      imageUrl: url,
                                      width: 140,
                                      height: 140,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  right: 4,
                                  top: 4,
                                  child: GestureDetector(
                                    onTap: () => _removePhoto(index),
                                    child: Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: const BoxDecoration(
                                        color: Colors.black54,
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(Icons.close, color: Colors.white, size: 14),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  left: 4,
                                  bottom: 4,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.black54,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Row(
                                      children: [
                                        Icon(Icons.tune, color: Colors.white, size: 12),
                                        SizedBox(width: 2),
                                        Text('Filter', style: TextStyle(color: Colors.white, fontSize: 10)),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          // Attachment Action Bar at the Bottom
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                // Add Photo Button
                IconButton(
                  icon: const Icon(Icons.photo_library_rounded, color: AppColors.accent, size: 24),
                  onPressed: _addPhoto,
                ),
                // Location Picker Button
                IconButton(
                  icon: const Icon(Icons.location_on_outlined, color: AppColors.accent, size: 24),
                  onPressed: () {
                    setState(() {
                      _selectedLocation = '📍 Library Quad';
                    });
                  },
                ),
                // Music Selector Button
                IconButton(
                  icon: const Icon(Icons.music_note_outlined, color: AppColors.accent, size: 24),
                  onPressed: () {
                    setState(() {
                      _selectedMusic = '🎵 Lo-Fi Beats';
                    });
                  },
                ),
                // Mentions Button
                IconButton(
                  icon: const Icon(Icons.alternate_email_rounded, color: AppColors.accent, size: 22),
                  onPressed: () {
                    _captionController.text += ' @campus_friend';
                  },
                ),
                // Poll Button
                IconButton(
                  icon: const Icon(Icons.poll_outlined, color: AppColors.accent, size: 24),
                  onPressed: () {
                    _captionController.text += '\n📊 Poll: Best campus coffee spot?';
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
