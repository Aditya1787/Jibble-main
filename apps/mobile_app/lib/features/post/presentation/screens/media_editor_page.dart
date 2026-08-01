import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class MediaEditorPage extends StatefulWidget {
  final String imagePath;

  const MediaEditorPage({super.key, required this.imagePath});

  @override
  State<MediaEditorPage> createState() => _MediaEditorPageState();
}

class _MediaEditorPageState extends State<MediaEditorPage> {
  int _selectedFilterIndex = 0;

  static const List<Map<String, dynamic>> _filters = [
    {
      'name': 'Normal',
      'matrix': [
        1.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
    {
      'name': 'Vivid',
      'matrix': [
        1.2, 0.0, 0.0, 0.0, 10.0,
        0.0, 1.2, 0.0, 0.0, 10.0,
        0.0, 0.0, 1.2, 0.0, 10.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
    {
      'name': 'Warm',
      'matrix': [
        1.2, 0.0, 0.0, 0.0, 20.0,
        0.0, 1.1, 0.0, 0.0, 10.0,
        0.0, 0.0, 0.9, 0.0, -10.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
    {
      'name': 'Cool',
      'matrix': [
        0.9, 0.0, 0.0, 0.0, -10.0,
        0.0, 1.1, 0.0, 0.0, 10.0,
        0.0, 0.0, 1.3, 0.0, 20.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
    {
      'name': 'Vintage',
      'matrix': [
        0.393, 0.769, 0.189, 0.0, 0.0,
        0.349, 0.686, 0.168, 0.0, 0.0,
        0.272, 0.534, 0.131, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
    {
      'name': 'Noir',
      'matrix': [
        0.33, 0.33, 0.33, 0.0, 0.0,
        0.33, 0.33, 0.33, 0.0, 0.0,
        0.33, 0.33, 0.33, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
      ]
    },
  ];

  @override
  Widget build(BuildContext context) {
    final currentMatrix = List<double>.from(_filters[_selectedFilterIndex]['matrix']);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Edit Photo Filters', style: TextStyle(color: Colors.white, fontSize: 16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, _filters[_selectedFilterIndex]['name']),
            child: const Text('Done', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 15)),
          ),
        ],
      ),
      body: Column(
        children: [
          // Main Filtered Image Preview
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: ColorFiltered(
                    colorFilter: ColorFilter.matrix(currentMatrix),
                    child: Image.network(
                      widget.imagePath,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        height: 300,
                        color: Colors.grey[900],
                        child: const Icon(Icons.image, color: Colors.white54, size: 60),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Horizontal Filter Presets Selector Bar
          Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            color: Colors.black,
            height: 140,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filters.length,
              itemBuilder: (context, index) {
                final filter = _filters[index];
                final isSelected = index == _selectedFilterIndex;
                final filterMatrix = List<double>.from(filter['matrix']);

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedFilterIndex = index;
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(right: 14),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSelected ? AppColors.accent : Colors.transparent,
                              width: 2.5,
                            ),
                          ),
                          child: ClipOval(
                            child: ColorFiltered(
                              colorFilter: ColorFilter.matrix(filterMatrix),
                              child: Image.network(
                                widget.imagePath,
                                width: 56,
                                height: 56,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  width: 56,
                                  height: 56,
                                  color: Colors.grey[800],
                                  child: const Icon(Icons.filter, color: Colors.white, size: 24),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          filter['name'],
                          style: TextStyle(
                            color: isSelected ? AppColors.accent : Colors.white70,
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
