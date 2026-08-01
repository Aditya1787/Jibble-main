import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'package:jibble_mobile/core/router/app_router.dart';
import 'package:jibble_mobile/features/auth/presentation/provider/auth_provider.dart';

class ProfilePicturePage extends ConsumerStatefulWidget {
  const ProfilePicturePage({super.key});
  @override
  ConsumerState<ProfilePicturePage> createState() => _ProfilePicturePageState();
}

class _ProfilePicturePageState extends ConsumerState<ProfilePicturePage> {
  File? _image;
  final bool _uploading = false;

  Future<void> _pickImage(ImageSource src) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: src,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 85,
    );
    if (picked != null) setState(() => _image = File(picked.path));
  }

  void _showSourceSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.background,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: AppColors.textMuted.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.camera_alt_rounded, color: AppColors.accent),
              title: const Text('Take a photo', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_rounded, color: AppColors.accent),
              title: const Text('Choose from gallery', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _finish() {
    ref.read(authProvider.notifier).completeOnboarding();
    context.go(Routes.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: NeumorphicBox(
            borderRadius: 24,
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const _ProgressBar(step: 6, total: 6),
                const SizedBox(height: 28),
                
                const Text('Profile Picture',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                const Text('Add a photo so people recognise you',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 40),

                // Avatar Picker Circle
                GestureDetector(
                  onTap: _showSourceSheet,
                  child: Stack(
                    children: [
                      NeumorphicBox(
                        shape: BoxShape.circle,
                        padding: EdgeInsets.zero,
                        child: Container(
                          width: 128,
                          height: 128,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            image: _image != null
                                ? DecorationImage(
                                    image: FileImage(_image!),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                          ),
                          child: _image == null
                              ? const Icon(
                                  Icons.person_rounded,
                                  size: 64,
                                  color: AppColors.textMuted,
                                )
                              : null,
                        ),
                      ),
                      const Positioned(
                        bottom: 0, right: 0,
                        child: NeumorphicBox(
                          shape: BoxShape.circle,
                          color: AppColors.accent,
                          padding: EdgeInsets.all(8),
                          child: Icon(Icons.camera_alt_rounded,
                              size: 16, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                const Text('Tap to add a photo',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),

                const Spacer(),
                
                // Finish Setup
                GestureDetector(
                  onTap: _uploading ? null : _finish,
                  child: NeumorphicBox(
                    color: AppColors.accent,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    borderRadius: 16,
                    child: Center(
                      child: _uploading
                          ? const SizedBox(
                              height: 22, width: 22,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2.5, color: Colors.white))
                          : const Text(
                              'Finish Setup',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Skip for now
                GestureDetector(
                  onTap: _finish,
                  child: const NeumorphicBox(
                    padding: EdgeInsets.symmetric(vertical: 14),
                    borderRadius: 16,
                    child: Center(
                      child: Text(
                        'Skip for now',
                        style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final int step;
  final int total;
  const _ProgressBar({required this.step, required this.total});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(total, (i) {
        final active = i < step;
        return Expanded(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            height:  6,
            margin:  EdgeInsets.only(right: i < total - 1 ? 6 : 0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(3),
              color: active ? AppColors.accent : const Color(0xFFDCD7CE),
            ),
          ),
        );
      }),
    );
  }
}
