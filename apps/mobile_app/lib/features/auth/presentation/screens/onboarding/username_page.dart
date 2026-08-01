import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'profile_picture_page.dart';

class UsernamePage extends StatefulWidget {
  const UsernamePage({super.key});
  @override
  State<UsernamePage> createState() => _UsernamePageState();
}

class _UsernamePageState extends State<UsernamePage> {
  final _ctrl = TextEditingController();
  String? _error;
  bool _valid = false;

  static final _re = RegExp(r'^[a-z0-9_.]{3,30}$');

  void _validate(String v) {
    v = v.toLowerCase().trim();
    setState(() {
      if (v.isEmpty)       { _error = null; _valid = false; }
      else if (v.length < 3) { _error = 'At least 3 characters'; _valid = false; }
      else if (!_re.hasMatch(v)) { _error = 'Only letters, numbers, _ and .'; _valid = false; }
      else                 { _error = null; _valid = true; }
    });
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _ProgressBar(step: 5, total: 6),
                const SizedBox(height: 24),
                
                const Text('Choose a Username',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                const Text('Your unique handle on Jibble',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 32),
                
                // Recessed Username input
                NeumorphicBox(
                  isRecessed: true,
                  borderRadius: 16,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: TextField(
                    controller: _ctrl,
                    onChanged: _validate,
                    textInputAction: TextInputAction.done,
                    style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z0-9_.]')),
                      LengthLimitingTextInputFormatter(30),
                    ],
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      labelText: 'Username',
                      floatingLabelBehavior: FloatingLabelBehavior.auto,
                      prefixText: '@',
                      prefixStyle: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.accent, fontSize: 16),
                      prefixIcon: const Icon(Icons.alternate_email_rounded, color: AppColors.textMuted),
                      errorText: _error,
                      suffixIcon: _valid
                          ? const Icon(Icons.check_circle_rounded,
                              color: AppColors.accent)
                          : null,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text('Lowercase letters, numbers, underscores and dots only.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
                
                const Spacer(),

                // Next Button
                GestureDetector(
                  onTap: !_valid
                      ? null
                      : () => Navigator.of(context).push(MaterialPageRoute(
                          builder: (_) => const ProfilePicturePage())),
                  child: Opacity(
                    opacity: !_valid ? 0.5 : 1.0,
                    child: const NeumorphicBox(
                      color: AppColors.accent,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      borderRadius: 16,
                      child: Center(
                        child: Text(
                          'Continue',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
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
