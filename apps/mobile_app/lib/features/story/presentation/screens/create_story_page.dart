import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../../../auth/presentation/provider/auth_provider.dart';
import '../../../stories/data/models/story_model.dart';
import '../../../stories/presentation/provider/stories_provider.dart';

/// Dedicated Neumorphic Story Creation Screen supporting photos, text, reels & post shares.
class CreateStoryPage extends ConsumerStatefulWidget {
  const CreateStoryPage({super.key});

  @override
  ConsumerState<CreateStoryPage> createState() => _CreateStoryPageState();
}

class _CreateStoryPageState extends ConsumerState<CreateStoryPage> {
  int _selectedGradientIndex = 0;
  final TextEditingController _storyTextController = TextEditingController();
  String? _selectedMusic;
  String? _selectedLocation;
  String? _selectedPhotoUrl;

  static const List<List<Color>> _gradients = [
    [Color(0xFF6A11CB), Color(0xFF2575FC)],
    [Color(0xFFFF0844), Color(0xFFFFB199)],
    [Color(0xFF0BA360), Color(0xFF3CBA92)],
    [Color(0xFF1F1C2C), Color(0xFF928DAB)],
  ];

  static const List<String> _sampleStoryPhotos = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  ];

  @override
  void dispose() {
    _storyTextController.dispose();
    super.dispose();
  }

  void _shareToStory() {
    final text = _storyTextController.text.trim();
    if (text.isEmpty && _selectedPhotoUrl == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add text or select a photo for your story.')),
      );
      return;
    }

    final user = ref.read(authProvider).user;
    final newStory = StoryItemModel(
      id: const Uuid().v4(),
      userId: user?.id ?? 'user-me-123',
      type: _selectedPhotoUrl != null ? 'image' : 'text',
      mediaUrl: _selectedPhotoUrl,
      textContent: text.isNotEmpty ? text : null,
      musicTitle: _selectedMusic,
      location: _selectedLocation,
      createdAt: DateTime.now(),
      hasViewed: false,
    );

    ref.read(storiesProvider.notifier).addStory(newStory);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Story posted successfully! 🎉')),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final currentGradient = _gradients[_selectedGradientIndex];

    return Scaffold(
      body: Stack(
        children: [
          // Gradient or Image Background Canvas
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            decoration: BoxDecoration(
              gradient: _selectedPhotoUrl == null
                  ? LinearGradient(
                      colors: currentGradient,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    )
                  : null,
              color: Colors.black,
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                if (_selectedPhotoUrl != null)
                  Image.network(
                    _selectedPhotoUrl!,
                    fit: BoxFit.cover,
                  ),
                Container(
                  color: Colors.black38,
                ),
                SafeArea(
                  child: Column(
                    children: [
                      // Top Toolbar
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            GestureDetector(
                              onTap: () => Navigator.pop(context),
                              child: const NeumorphicBox(
                                shape: BoxShape.circle,
                                padding: EdgeInsets.all(8),
                                color: Colors.black45,
                                child: Icon(Icons.close_rounded, color: Colors.white, size: 22),
                              ),
                            ),
                            Row(
                              children: [
                                // Photo picker toggle
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      if (_selectedPhotoUrl == null) {
                                        _selectedPhotoUrl = _sampleStoryPhotos[0];
                                      } else {
                                        final nextIdx = (_sampleStoryPhotos.indexOf(_selectedPhotoUrl!) + 1);
                                        if (nextIdx < _sampleStoryPhotos.length) {
                                          _selectedPhotoUrl = _sampleStoryPhotos[nextIdx];
                                        } else {
                                          _selectedPhotoUrl = null;
                                        }
                                      }
                                    });
                                  },
                                  child: const NeumorphicBox(
                                    shape: BoxShape.circle,
                                    padding: EdgeInsets.all(8),
                                    color: Colors.black45,
                                    child: Icon(Icons.photo_library_rounded, color: Colors.white, size: 20),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                // Palette background toggle
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedGradientIndex = (_selectedGradientIndex + 1) % _gradients.length;
                                    });
                                  },
                                  child: const NeumorphicBox(
                                    shape: BoxShape.circle,
                                    padding: EdgeInsets.all(8),
                                    color: Colors.black45,
                                    child: Icon(Icons.palette_rounded, color: Colors.white, size: 20),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                // Music picker
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedMusic = _selectedMusic == null ? '🎵 Campus Anthems #1' : null;
                                    });
                                  },
                                  child: NeumorphicBox(
                                    shape: BoxShape.circle,
                                    padding: const EdgeInsets.all(8),
                                    color: _selectedMusic != null ? AppColors.accent : Colors.black45,
                                    child: const Icon(Icons.music_note_rounded, color: Colors.white, size: 20),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Interactive Text & Overlay Canvas
                      Expanded(
                        child: Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (_selectedLocation != null) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.black45,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: Colors.white30),
                                    ),
                                    child: Text(
                                      _selectedLocation!,
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                ],
                                TextField(
                                  controller: _storyTextController,
                                  textAlign: TextAlign.center,
                                  maxLines: null,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 26,
                                    fontWeight: FontWeight.bold,
                                    shadows: [
                                      Shadow(color: Colors.black87, blurRadius: 12),
                                    ],
                                  ),
                                  decoration: const InputDecoration(
                                    hintText: 'Type your story...',
                                    hintStyle: TextStyle(color: Colors.white60, fontSize: 24),
                                    border: InputBorder.none,
                                  ),
                                ),
                                if (_selectedMusic != null) ...[
                                  const SizedBox(height: 16),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.black54,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: Colors.white24),
                                    ),
                                    child: Text(
                                      _selectedMusic!,
                                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Bottom Share Button
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _shareToStory,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              backgroundColor: Colors.white,
                              elevation: 8,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.send_rounded, color: Colors.black, size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Share to Story',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
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
