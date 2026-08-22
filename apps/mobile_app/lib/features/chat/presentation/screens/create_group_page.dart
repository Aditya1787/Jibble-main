import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Screen to create a new community group chat arena.
class CreateGroupPage extends StatefulWidget {
  const CreateGroupPage({super.key});

  @override
  State<CreateGroupPage> createState() => _CreateGroupPageState();
}

class _CreateGroupPageState extends State<CreateGroupPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  bool _isPrivate = false;

  final List<Map<String, dynamic>> _contacts = [
    {'name': 'Alex Rivera', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'selected': true},
    {'name': 'Sarah Chen', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'selected': true},
    {'name': 'David Kim', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'selected': false},
    {'name': 'Elena Rostova', 'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'selected': false},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _createGroup() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a group name')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎉 Group "$name" created successfully!'),
        backgroundColor: AppColors.accent,
      ),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: const Text('Create New Group', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Group Avatar Picker Center Box
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.accent.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.accent, width: 2),
                    ),
                    child: const Icon(Icons.group_rounded, size: 48, color: AppColors.accent),
                  ),
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 18),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Group Name Field
            const Text('Group Name', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                hintText: 'e.g. Campus Robotics Club',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Description Field
            const Text('Description', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(
              controller: _descController,
              maxLines: 2,
              decoration: InputDecoration(
                hintText: 'What is this group about?',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Privacy Switch Row
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Private Group', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                      Text(
                        _isPrivate ? 'Only invited members can join' : 'Anyone in community can join',
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                  Switch(
                    value: _isPrivate,
                    activeThumbColor: AppColors.accent,
                    onChanged: (val) {
                      setState(() {
                        _isPrivate = val;
                      });
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Add Members Section
            const Text('Add Initial Members', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),
            Column(
              children: _contacts.map((contact) {
                final isSelected = contact['selected'] as bool;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(contact['avatar']),
                    ),
                    title: Text(contact['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    trailing: Checkbox(
                      value: isSelected,
                      activeColor: AppColors.accent,
                      onChanged: (val) {
                        setState(() {
                          contact['selected'] = val;
                        });
                      },
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Create Group Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _createGroup,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: AppColors.accent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text(
                  'Create Group Arena',
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
