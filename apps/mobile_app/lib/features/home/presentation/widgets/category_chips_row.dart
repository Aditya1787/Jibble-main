import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/presentation/widgets/neumorphic_box.dart';
import '../provider/feed_provider.dart';

/// Horizontally scrollable row of Neumorphic category chips filtering the feed.
class CategoryChipsRow extends ConsumerWidget {
  const CategoryChipsRow({super.key});

  static final List<Map<String, dynamic>> _categories = [
    {'name': 'All', 'icon': Icons.auto_awesome},
    {'name': 'Academics', 'icon': Icons.school_rounded},
    {'name': 'Sports', 'icon': Icons.sports_basketball_rounded},
    {'name': 'Meme', 'icon': Icons.sentiment_very_satisfied_rounded},
    {'name': 'Career', 'icon': Icons.work_rounded},
    {'name': 'Event', 'icon': Icons.event_rounded},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(feedProvider).selectedCategory;

    return SizedBox(
      height: 48,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final item = _categories[index];
          final categoryName = item['name'] as String;
          final iconData = item['icon'] as IconData;
          final isSelected = categoryName == selectedCategory;

          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: GestureDetector(
              onTap: () {
                ref.read(feedProvider.notifier).changeCategory(categoryName);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                child: isSelected
                    ? Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          gradient: AppColors.accentGradient,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.accent.withValues(alpha: 0.35),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Icon(iconData, size: 16, color: Colors.white),
                            const SizedBox(width: 6),
                            Text(
                              categoryName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      )
                    : NeumorphicBox(
                        borderRadius: 20,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        child: Row(
                          children: [
                            Icon(
                              iconData,
                              size: 16,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              categoryName,
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
              ),
            ),
          );
        },
      ),
    );
  }
}
