import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/search_result_model.dart';

class SearchResultTile extends StatelessWidget {
  final SearchResultModel item;
  final VoidCallback? onTap;

  const SearchResultTile({super.key, required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    IconData getFallbackIcon() {
      switch (item.type) {
        case 'user':
          return Icons.person;
        case 'circle':
          return Icons.groups;
        case 'event':
          return Icons.event;
        case 'group':
          return Icons.forum;
        default:
          return Icons.search;
      }
    }

    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.2),
        backgroundImage: item.avatarUrl != null ? NetworkImage(item.avatarUrl!) : null,
        child: item.avatarUrl == null ? Icon(getFallbackIcon(), color: Colors.white70, size: 20) : null,
      ),
      title: Text(
        item.title,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15),
      ),
      subtitle: item.subtitle != null
          ? Text(
              item.subtitle!,
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 13),
            )
          : null,
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          item.type.toUpperCase(),
          style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 10, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
