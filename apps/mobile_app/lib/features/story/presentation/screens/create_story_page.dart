import 'package:flutter/material.dart';

/// Dedicated Story Creation Screen with gradient backgrounds, stickers, and music options.
class CreateStoryPage extends StatefulWidget {
  const CreateStoryPage({super.key});

  @override
  State<CreateStoryPage> createState() => _CreateStoryPageState();
}

class _CreateStoryPageState extends State<CreateStoryPage> {
  int _selectedGradientIndex = 0;
  final TextEditingController _storyTextController = TextEditingController();
  String? _selectedMusic;
  String? _selectedLocation;

  static const List<List<Color>> _gradients = [
    [Color(0xFF6A11CB), Color(0xFF2575FC)],
    [Color(0xFFFF0844), Color(0xFFFFB199)],
    [Color(0xFF0BA360), Color(0xFF3CBA92)],
    [Color(0xFF1F1C2C), Color(0xFF928DAB)],
  ];

  @override
  void dispose() {
    _storyTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentGradient = _gradients[_selectedGradientIndex];

    return Scaffold(
      body: Stack(
        children: [
          // Gradient Story Canvas Background
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: currentGradient,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // Top Toolbar
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: Colors.white, size: 28),
                          onPressed: () => Navigator.pop(context),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.palette_rounded, color: Colors.white, size: 26),
                              onPressed: () {
                                setState(() {
                                  _selectedGradientIndex = (_selectedGradientIndex + 1) % _gradients.length;
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.music_note_rounded, color: Colors.white, size: 26),
                              onPressed: () {
                                setState(() {
                                  _selectedMusic = '🎵 Campus Anthems #1';
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.location_on_rounded, color: Colors.white, size: 26),
                              onPressed: () {
                                setState(() {
                                  _selectedLocation = '📍 Student Center';
                                });
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Interactive Story Text & Stickers Area
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
                                  color: Colors.white.withValues(alpha: 0.25),
                                  borderRadius: BorderRadius.circular(20),
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
                                  Shadow(color: Colors.black45, blurRadius: 10),
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
                                  color: Colors.black38,
                                  borderRadius: BorderRadius.circular(20),
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

                  // Bottom Action Bar: "Share to Story"
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Story posted successfully! 🎉')),
                          );
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: Colors.white,
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
          ),
        ],
      ),
    );
  }
}
