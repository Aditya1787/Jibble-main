import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/search_result_model.dart';
import '../widgets/search_result_tile.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'all';

  final List<SearchResultModel> _mockResults = const [
    SearchResultModel(
      id: '1',
      type: 'user',
      title: 'Elena Vance',
      subtitle: '@elena_v',
      extraInfo: 'UI/UX & Sound Engineering',
    ),
    SearchResultModel(
      id: '2',
      type: 'circle',
      title: 'Stanford AI & Robotics',
      subtitle: '4,120 members',
      extraInfo: 'Leading hub for machine learning students',
    ),
    SearchResultModel(
      id: '3',
      type: 'event',
      title: 'Hackathon 2026 Kickoff',
      subtitle: 'Online • Starts 6:00 PM',
      extraInfo: 'https://meet.jit.si/jibble-hackathon-2026',
    ),
    SearchResultModel(
      id: '4',
      type: 'group',
      title: 'Frontend Explorers',
      subtitle: '340 members',
      extraInfo: 'Flutter & Web discussions',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _mockResults.where((item) {
      if (_selectedCategory == 'all') return true;
      return item.type == _selectedCategory;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: Container(
          height: 42,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            controller: _searchController,
            style: const TextStyle(color: Colors.white, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Search people, circles, events, groups...',
              hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 13),
              prefixIcon: const Icon(Icons.search, color: Colors.white54, size: 20),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                _buildFilterChip('All', 'all'),
                _buildFilterChip('Users', 'user'),
                _buildFilterChip('Circles', 'circle'),
                _buildFilterChip('Events', 'event'),
                _buildFilterChip('Groups', 'group'),
              ],
            ),
          ),
          const Divider(color: Colors.white12, height: 1),

          // Results List
          Expanded(
            child: ListView.separated(
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const Divider(color: Colors.white10, height: 1),
              itemBuilder: (context, index) {
                return SearchResultTile(item: filtered[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _selectedCategory == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: AppColors.primaryViolet,
        backgroundColor: Colors.white.withValues(alpha: 0.06),
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 13,
        ),
        onSelected: (selected) {
          if (selected) setState(() => _selectedCategory = value);
        },
      ),
    );
  }
}
