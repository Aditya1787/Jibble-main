import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Dedicated Reel Creator Screen for recording/uploading short videos with filters & hashtags.
class CreateReelPage extends StatefulWidget {
  const CreateReelPage({super.key});

  @override
  State<CreateReelPage> createState() => _CreateReelPageState();
}

class _CreateReelPageState extends State<CreateReelPage> {
  final TextEditingController _captionController = TextEditingController();
  final String _selectedAudioTrack = '🎵 Trending Campus Vibe - Original Sound';
  String _reelDestination = 'global_reels'; // 'global_reels' or 'circle'
  
  int _selectedDurationIndex = 1; // 30s default
  int _selectedFilterIndex = 0;
  bool _isUploading = false;
  double _uploadProgress = 0.0;

  final List<String> _durations = ['15s', '30s', '60s', '90s'];
  final List<Map<String, dynamic>> _filters = [
    {'name': 'Normal', 'color': Colors.transparent},
    {'name': 'Vintage', 'color': Colors.amber.withValues(alpha: 0.2)},
    {'name': 'Vibrant', 'color': Colors.pink.withValues(alpha: 0.2)},
    {'name': 'Cyber', 'color': Colors.cyan.withValues(alpha: 0.2)},
    {'name': 'Noir', 'color': Colors.black.withValues(alpha: 0.4)},
  ];

  final List<String> _popularHashtags = ['#Jibble', '#CampusVibes', '#CodingLife', '#Hackathon2026', '#Reels'];

  @override
  void dispose() {
    _captionController.dispose();
    super.dispose();
  }

  void _addHashtag(String tag) {
    setState(() {
      _captionController.text = '${_captionController.text} $tag '.trimLeft();
    });
  }

  void _simulateUpload() async {
    setState(() {
      _isUploading = true;
      _uploadProgress = 0.1;
    });

    for (int i = 1; i <= 10; i++) {
      await Future.delayed(const Duration(milliseconds: 150));
      if (mounted) {
        setState(() {
          _uploadProgress = i / 10;
        });
      }
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Reel published successfully to Jibble Feed!'),
          backgroundColor: AppColors.accent,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Create New Reel', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Video Canvas Preview Box
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 340,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1B1B2A),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Selected Filter Layer
                      Container(
                        decoration: BoxDecoration(
                          color: _filters[_selectedFilterIndex]['color'],
                          borderRadius: BorderRadius.circular(24),
                        ),
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: AppColors.accent.withValues(alpha: 0.25),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.video_call_rounded, size: 52, color: AppColors.accentLight),
                          ),
                          const SizedBox(height: 14),
                          const Text(
                            'Tap to Select Video File',
                            style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Supports MP4, MOV (Up to 1080p)',
                            style: TextStyle(color: Colors.white54, fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Top Duration Selector Pill
                Positioned(
                  top: 14,
                  right: 14,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white24),
                    ),
                    child: Row(
                      children: List.generate(_durations.length, (idx) {
                        final isSelected = _selectedDurationIndex == idx;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedDurationIndex = idx;
                            });
                          },
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.accent : Colors.transparent,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              _durations[idx],
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.white60,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Video Filter Options Carousel
            const Text(
              'Apply Video Filter',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _filters.length,
                itemBuilder: (ctx, i) {
                  final filter = _filters[i];
                  final isSelected = _selectedFilterIndex == i;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedFilterIndex = i;
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.accent : const Color(0xFF1E1E2C),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: isSelected ? Colors.white30 : Colors.white10),
                      ),
                      child: Text(
                        filter['name'],
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.white70,
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 18),

            // Audio Track Selector Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E2C),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.music_note_rounded, color: AppColors.accentLight, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _selectedAudioTrack,
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded, color: Colors.white54),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Destination Selector Pill
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E2C),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _reelDestination = 'global_reels'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _reelDestination == 'global_reels' ? AppColors.accent : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            '🎬 Global Reels',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _reelDestination == 'global_reels' ? Colors.white : Colors.white60,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _reelDestination = 'circle'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _reelDestination == 'circle' ? AppColors.accent : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            '🎯 Circle Reel',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _reelDestination == 'circle' ? Colors.white : Colors.white60,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Caption Input
            const Text(
              'Caption & Hashtags',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _captionController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Write a catchy caption...',
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: const Color(0xFF1E1E2C),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Popular Hashtag Chips
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _popularHashtags.map((tag) {
                return GestureDetector(
                  onTap: () => _addHashtag(tag),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white10,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(tag, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Upload Progress or Publish Button
            if (_isUploading) ...[
              LinearProgressIndicator(
                value: _uploadProgress,
                backgroundColor: Colors.white10,
                color: AppColors.accent,
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ),
              const SizedBox(height: 10),
              Center(
                child: Text(
                  'Publishing Reel... ${(_uploadProgress * 100).toInt()}%',
                  style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ),
            ] else
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _simulateUpload,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: AppColors.accent,
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Publish Reel',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
