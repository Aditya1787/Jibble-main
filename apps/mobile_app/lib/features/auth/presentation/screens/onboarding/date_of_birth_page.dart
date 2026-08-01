import 'package:flutter/material.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'interests_page.dart';

class DateOfBirthPage extends StatefulWidget {
  const DateOfBirthPage({super.key});

  @override
  State<DateOfBirthPage> createState() => _DateOfBirthPageState();
}

class _DateOfBirthPageState extends State<DateOfBirthPage> {
  DateTime? _dob;

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final oldest = DateTime(now.year - 60);
    final youngest = DateTime(now.year - 13); // 13+ required

    final picked = await showDatePicker(
      context:      context,
      initialDate:  _dob ?? DateTime(now.year - 20),
      firstDate:    oldest,
      lastDate:     youngest,
      helpText:     'Select your date of birth',
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(
            primary: AppColors.accent,
            onPrimary: Colors.white,
            surface: AppColors.background,
            onSurface: AppColors.textPrimary,
          ),
        ),
        child: child!,
      ),
    );

    if (picked != null) setState(() => _dob = picked);
  }

  String get _formatted {
    if (_dob == null) return 'Tap to select';
    return '${_dob!.day.toString().padLeft(2, '0')} / '
        '${_dob!.month.toString().padLeft(2, '0')} / '
        '${_dob!.year}';
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _ProgressBar(step: 2, total: 6),
                const SizedBox(height: 24),

                Text('Date of Birth',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                Text('You must be 13 or older to join Jibble',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 32),

                // Date picker tile in a recessed panel
                GestureDetector(
                  onTap: _pickDate,
                  child: NeumorphicBox(
                    isRecessed: true,
                    borderRadius: 16,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                    child: Row(
                      children: [
                        Icon(
                          Icons.calendar_today_rounded,
                          color: _dob != null ? AppColors.accent : AppColors.textMuted,
                        ),
                        const SizedBox(width: 16),
                        Text(
                          _formatted,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: _dob != null ? AppColors.textPrimary : AppColors.textMuted,
                          ),
                        ),
                        const Spacer(),
                        const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted),
                      ],
                    ),
                  ),
                ),

                const Spacer(),

                // Continue Button
                GestureDetector(
                  onTap: _dob == null
                      ? null
                      : () => Navigator.of(context).push(
                            MaterialPageRoute(
                                builder: (_) => const InterestsPage()),
                          ),
                  child: Opacity(
                    opacity: _dob == null ? 0.5 : 1.0,
                    child: NeumorphicBox(
                      color: AppColors.accent,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      borderRadius: 16,
                      child: const Center(
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
