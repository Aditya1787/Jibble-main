import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'date_of_birth_page.dart';

class CollegePage extends ConsumerStatefulWidget {
  const CollegePage({super.key});

  @override
  ConsumerState<CollegePage> createState() => _CollegePageState();
}

class _CollegePageState extends ConsumerState<CollegePage> {
  final _searchCtrl = TextEditingController();
  String? _selectedCollege;

  final _colleges = const [
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur',
    'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'DTU Delhi', 'NSUT Delhi',
    'Manipal Institute of Technology', 'SRM Institute', 'Jadavpur University',
    'Anna University', 'Amrita Vishwa Vidyapeetham', 'Thapar Institute',
    'IIIT Allahabad', 'PSG College of Technology', 'COEP Pune', 'RVCE Bangalore', 'Lovely Proffesional University'
  ];

  List<String> get _filtered {
    final q = _searchCtrl.text.trim().toLowerCase();
    if (q.isEmpty) return _colleges;
    return _colleges.where((c) => c.toLowerCase().contains(q)).toList();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
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
                // Progress Bar
                const _ProgressBar(step: 1, total: 6),
                const SizedBox(height: 24),

                // Heading
                Text('Your College',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                Text('Search and select your institution',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 20),

                // Search box
                NeumorphicBox(
                  isRecessed: true,
                  borderRadius: 16,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: TextField(
                    controller: _searchCtrl,
                    onChanged: (_) => setState(() {}),
                    style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      hintText: 'Search colleges...',
                      prefixIcon: Icon(Icons.search_rounded, color: AppColors.textMuted),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Suggestions list or helper
                Expanded(
                  child: _searchCtrl.text.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.school_outlined,
                                size: 56,
                                color: AppColors.textMuted.withOpacity(0.4),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Type to search your college\n(Or click Continue to skip)',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        )
                      : _filtered.isEmpty
                          ? const Center(
                              child: Text(
                                'No colleges found',
                                style: TextStyle(
                                  color: AppColors.danger,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            )
                          : ListView.builder(
                              itemCount: _filtered.length,
                              itemBuilder: (_, i) {
                                final name     = _filtered[i];
                                final selected = name == _selectedCollege;
                                return GestureDetector(
                                  onTap: () => setState(() => _selectedCollege = name),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 150),
                                    margin: const EdgeInsets.only(bottom: 12),
                                    child: NeumorphicBox(
                                      isRecessed: selected,
                                      borderRadius: 14,
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                      child: Row(
                                        children: [
                                          Icon(
                                            Icons.school_rounded,
                                            color: selected ? AppColors.accent : AppColors.textMuted,
                                          ),
                                          const SizedBox(width: 14),
                                          Expanded(
                                            child: Text(
                                              name,
                                              style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: selected ? FontWeight.bold : FontWeight.w600,
                                                color: selected ? AppColors.accentDark : AppColors.textPrimary,
                                              ),
                                            ),
                                          ),
                                          if (selected)
                                            const Icon(Icons.check_circle_rounded, color: AppColors.accent),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                ),

                // Next button
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: _selectedCollege == null
                      ? null
                      : () => Navigator.of(context).push(
                            MaterialPageRoute(
                                builder: (_) => const DateOfBirthPage()),
                          ),
                  child: Opacity(
                    opacity: _selectedCollege == null ? 0.5 : 1.0,
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
