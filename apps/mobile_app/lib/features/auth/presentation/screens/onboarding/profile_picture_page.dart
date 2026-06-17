import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../auth_gate.dart';

/// Onboarding step 6 — User uploads a profile picture (optional).
class ProfilePicturePage extends StatefulWidget {
  const ProfilePicturePage({super.key});
  @override
  State<ProfilePicturePage> createState() => _ProfilePicturePageState();
}

class _ProfilePicturePageState extends State<ProfilePicturePage> {
  File? _image;
  bool _uploading = false;

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
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[600],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.camera_alt_rounded),
              title: const Text('Take a photo'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_rounded),
              title: const Text('Choose from gallery'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  void _finish() {
    // TODO: upload _image to S3 via PUT presigned URL, then update profile
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const AuthGate()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _ProgressBar(step: 6, total: 6),
              const SizedBox(height: 32),
              Text('Profile Picture',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary)),
              const SizedBox(height: 6),
              Text('Add a photo so people recognise you',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[400])),
              const SizedBox(height: 48),

              // ── Avatar picker ─────────────────────────────────────────
              GestureDetector(
                onTap: _showSourceSheet,
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 64,
                      backgroundImage:
                          _image != null ? FileImage(_image!) : null,
                      backgroundColor:
                          Theme.of(context).colorScheme.surface,
                      child: _image == null
                          ? Icon(Icons.person_rounded,
                              size: 64,
                              color: Theme.of(context)
                                  .colorScheme
                                  .primary
                                  .withOpacity(0.5))
                          : null,
                    ),
                    Positioned(
                      bottom: 0, right: 0,
                      child: Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Theme.of(context).colorScheme.primary,
                              Theme.of(context).colorScheme.secondary,
                            ],
                          ),
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: Theme.of(context)
                                  .scaffoldBackgroundColor,
                              width: 2),
                        ),
                        child: const Icon(Icons.camera_alt_rounded,
                            size: 18, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text('Tap to add a photo',
                  style: TextStyle(color: Colors.grey[500], fontSize: 13)),

              const Spacer(),
              ElevatedButton(
                onPressed: _uploading ? null : _finish,
                child: _uploading
                    ? const SizedBox(
                        height: 22, width: 22,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Text('Finish Setup'),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: _finish,
                child: Text('Skip for now',
                    style: TextStyle(color: Colors.grey[500])),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final int step, total;
  const _ProgressBar({required this.step, required this.total});
  @override
  Widget build(BuildContext context) => Row(
      children: List.generate(
          total,
          (i) => Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 4,
                  margin: EdgeInsets.only(right: i < total - 1 ? 4 : 0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(2),
                    color: i < step
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.surface,
                  ),
                ),
              )));
}
