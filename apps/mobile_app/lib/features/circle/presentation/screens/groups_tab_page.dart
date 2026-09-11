import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/group_model.dart';
import '../../../chat/presentation/screens/chat_arena_page.dart';

class GroupsTabPage extends StatefulWidget {
  final String circleId;

  const GroupsTabPage({
    super.key,
    required this.circleId,
  });

  @override
  State<GroupsTabPage> createState() => _GroupsTabPageState();
}

class _GroupsTabPageState extends State<GroupsTabPage> {
  final List<GroupModel> _groups = [
    const GroupModel(
      id: 'grp-1',
      circleId: 'circle-1',
      name: 'Flutter & Dart Developers',
      description: 'Mobile engineers collaborating on community projects and app architectures.',
      iconName: 'code',
      membersCount: 48,
      isMember: true,
      createdAt: '2026-01-10',
    ),
    const GroupModel(
      id: 'grp-2',
      circleId: 'circle-1',
      name: 'Competitive Programming & DSA',
      description: 'Daily LeetCode discussions, contest post-mortems, and algorithmic study.',
      iconName: 'psychology',
      membersCount: 82,
      isMember: false,
      createdAt: '2026-01-15',
    ),
    const GroupModel(
      id: 'grp-3',
      circleId: 'circle-1',
      name: 'Placement & Internship Prep',
      description: 'Resume reviews, interview experiences, and referral sharing.',
      iconName: 'work',
      membersCount: 110,
      isMember: true,
      createdAt: '2026-02-01',
    ),
  ];

  void _openCreateGroupModal() {
    final nameController = TextEditingController();
    final descController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: EdgeInsets.only(
          top: 24,
          left: 20,
          right: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
        ),
        decoration: const BoxDecoration(
          color: AppColors.background,
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
                  const Text(
                    'Create Sub-Group',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: nameController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Group Name',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: descController,
                maxLines: 2,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Group Purpose / Topic',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (nameController.text.trim().isEmpty) return;
                    final newGrp = GroupModel(
                      id: 'grp-${DateTime.now().millisecondsSinceEpoch}',
                      circleId: widget.circleId,
                      name: nameController.text.trim(),
                      description: descController.text.trim(),
                      membersCount: 1,
                      isMember: true,
                      createdAt: DateTime.now().toIso8601String(),
                    );
                    setState(() {
                      _groups.insert(0, newGrp);
                    });
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Sub-group "${newGrp.name}" initialized!')),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Create Sub-Group', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openGroupChat(GroupModel group) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChatArenaPage(
          userName: group.name,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openCreateGroupModal,
        backgroundColor: AppColors.accent,
        icon: const Icon(Icons.group_add_rounded, color: Colors.white),
        label: const Text('New Sub-Group', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _groups.length,
        itemBuilder: (context, index) {
          final grp = _groups[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            color: AppColors.card,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: AppColors.border),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.accent.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.forum_rounded, color: AppColors.accent, size: 22),
              ),
              title: Text(
                grp.name,
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontSize: 15),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (grp.description != null) ...[
                    const SizedBox(height: 3),
                    Text(
                      grp.description!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    ),
                  ],
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.people_alt_outlined, size: 14, color: AppColors.accentLight),
                      const SizedBox(width: 4),
                      Text(
                        '${grp.membersCount} members',
                        style: const TextStyle(color: AppColors.accentLight, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
              trailing: ElevatedButton(
                onPressed: () {
                  if (!grp.isMember) {
                    setState(() {
                      _groups[index] = grp.copyWith(
                        isMember: true,
                        membersCount: grp.membersCount + 1,
                      );
                    });
                  } else {
                    _openGroupChat(grp);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: grp.isMember ? AppColors.accent : AppColors.surface,
                  side: grp.isMember ? null : const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  grp.isMember ? 'Chat' : 'Join',
                  style: TextStyle(
                    color: grp.isMember ? Colors.white : AppColors.accent,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
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
