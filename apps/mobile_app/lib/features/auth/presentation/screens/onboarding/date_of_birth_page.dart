import 'package:flutter/material.dart';
import 'interests_page.dart';

/// Onboarding step 2 — User sets their date of birth.
class DateOfBirthPage extends StatefulWidget {
  const DateOfBirthPage({super.key});

  @override
  State<DateOfBirthPage> createState() => _DateOfBirthPageState();
}

class _DateOfBirthPageState extends State<DateOfBirthPage> {
  DateTime? _dob;

  Future<void> _pickDate() async {
    final now    = DateTime.now();
    final oldest = DateTime(now.year - 60);
    final youngest = DateTime(now.year - 13); // 13+ required

    final picked = await showDatePicker(
      context:      context,
      initialDate:  _dob ?? DateTime(now.year - 20),
      firstDate:    oldest,
      lastDate:     youngest,
      helpText:     'Select your date of birth',
      builder: (context, child) => Theme(
        data: Theme.of(context),
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _ProgressBar(step: 2, total: 6),
              const SizedBox(height: 32),

              Text('Date of Birth',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      )),
              const SizedBox(height: 6),
              Text('You must be 13 or older to join Jibble',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400])),
              const SizedBox(height: 40),

              // ── Date picker tile ──────────────────────────────────────
              InkWell(
                onTap:         _pickDate,
                borderRadius:  BorderRadius.circular(14),
                child: Container(
                  width:   double.infinity,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 18),
                  decoration: BoxDecoration(
                    color:        Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(14),
                    border:       Border.all(
                      color: _dob != null
                          ? Theme.of(context).colorScheme.primary
                          : Colors.white12,
                      width: _dob != null ? 1.5 : 1,
                    ),
                  ),
                  child: Row(children: [
                    Icon(Icons.calendar_today_rounded,
                        color: _dob != null
                            ? Theme.of(context).colorScheme.primary
                            : Colors.grey[500]),
                    const SizedBox(width: 16),
                    Text(_formatted,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: _dob != null ? null : Colors.grey[500],
                            )),
                    const Spacer(),
                    const Icon(Icons.chevron_right_rounded,
                        color: Colors.grey),
                  ]),
                ),
              ),

              const Spacer(),
              ElevatedButton(
                onPressed: _dob == null
                    ? null
                    : () => Navigator.of(context).push(
                          MaterialPageRoute(
                              builder: (_) => const InterestsPage()),
                        ),
                child: const Text('Continue'),
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
        children: List.generate(total, (i) => Expanded(
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
        )),
      );
}
