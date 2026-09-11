import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/profile_model.dart';
import 'edit_profile_page.dart';

class UserProfilePage extends StatefulWidget {
  final String? username;

  const UserProfilePage({super.key, this.username});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  ProfileModel _profile = const ProfileModel(
    userId: '1',
    username: 'creator_pro',
    displayName: 'Alex Rivers',
    bio: 'Digital artist & community builder. Creating the next wave on Jibble ✨',
    isVerified: true,
    followersCount: 1240,
    followingCount: 380,
    postsCount: 42,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        title: Text(
          '@${_profile.username}',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.primaryViolet.withValues(alpha: 0.3),
                    backgroundImage: _profile.avatarUrl != null ? NetworkImage(_profile.avatarUrl!) : null,
                    child: _profile.avatarUrl == null
                        ? Text(
                            _profile.displayName.isNotEmpty ? _profile.displayName[0].toUpperCase() : '?',
                            style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                          )
                        : null,
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatColumn('Posts', _profile.postsCount),
                        _buildStatColumn('Followers', _profile.followersCount),
                        _buildStatColumn('Following', _profile.followingCount),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Bio & Name
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          _profile.displayName,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        if (_profile.isVerified) ...[
                          const SizedBox(width: 6),
                          const Icon(Icons.verified, color: AppColors.primaryViolet, size: 18),
                        ],
                      ],
                    ),
                    if (_profile.bio != null) ...[
                      const SizedBox(height: 6),
                      Text(
                        _profile.bio!,
                        style: const TextStyle(color: Colors.white70, fontSize: 14, height: 1.3),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // Edit Profile Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () async {
                    final updated = await Navigator.of(context).push<ProfileModel>(
                      MaterialPageRoute(builder: (_) => EditProfilePage(profile: _profile)),
                    );
                    if (updated != null) {
                      setState(() => _profile = updated);
                    }
                  },
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('Edit Profile', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                ),
              ),
            ),

            const Divider(color: Colors.white12),

            // Grid of Posts
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.all(4),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 4,
                mainAxisSpacing: 4,
              ),
              itemCount: 9,
              itemBuilder: (context, index) {
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Center(
                    child: Icon(Icons.image_outlined, color: Colors.white.withValues(alpha: 0.2)),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(String label, int count) {
    return Column(
      children: [
        Text(
          '$count',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12),
        ),
      ],
    );
  }
}
