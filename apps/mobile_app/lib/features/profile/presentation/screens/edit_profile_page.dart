import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/profile_model.dart';

class EditProfilePage extends StatefulWidget {
  final ProfileModel profile;

  const EditProfilePage({super.key, required this.profile});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  late TextEditingController _nameController;
  late TextEditingController _bioController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.profile.displayName);
    _bioController = TextEditingController(text: widget.profile.bio ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: const Text('Edit Profile', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          TextButton(
            onPressed: () {
              final updated = ProfileModel(
                userId: widget.profile.userId,
                username: widget.profile.username,
                displayName: _nameController.text.trim(),
                bio: _bioController.text.trim(),
                avatarUrl: widget.profile.avatarUrl,
                isVerified: widget.profile.isVerified,
                followersCount: widget.profile.followersCount,
                followingCount: widget.profile.followingCount,
                postsCount: widget.profile.postsCount,
              );
              Navigator.of(context).pop(updated);
            },
            child: const Text(
              'Save',
              style: TextStyle(color: AppColors.primaryViolet, fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 46,
                    backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.3),
                    backgroundImage: widget.profile.avatarUrl != null ? NetworkImage(widget.profile.avatarUrl!) : null,
                    child: widget.profile.avatarUrl == null
                        ? Text(
                            widget.profile.displayName.isNotEmpty ? widget.profile.displayName[0].toUpperCase() : '?',
                            style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                          )
                        : null,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: AppColors.primaryViolet,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.camera_alt, color: Colors.white, size: 16),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),
            TextField(
              controller: _nameController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Display Name',
                labelStyle: TextStyle(color: Colors.white.withValues(alpha: 0.6)),
                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2))),
                focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primaryViolet)),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _bioController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Bio',
                labelStyle: TextStyle(color: Colors.white.withValues(alpha: 0.6)),
                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2))),
                focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primaryViolet)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
