import 'package:flutter/material.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'skills_page.dart';

class InterestsPage extends StatefulWidget {
  const InterestsPage({super.key});
  @override
  State<InterestsPage> createState() => _InterestsPageState();
}

class _InterestsPageState extends State<InterestsPage> {
  static const _allInterests = [
    '💻 Coding',      '🎨 Design',      '🤖 AI/ML',      '📱 App Dev',
    '🎮 Gaming',      '📚 Reading',     '🎵 Music',       '🎬 Films',
    '⚽ Sports',      '🏋️ Fitness',    '🚀 Startups',    '💡 Entrepreneurship',
    '🔬 Research',    '✍️ Writing',     '📸 Photography', '🌿 Environment',
    '🎭 Theatre',     '🍳 Cooking',     '✈️ Travel',      '🧩 Puzzles',
    '🧘 Yoga',        '🎨 Art',         '🔭 Astronomy',   '🌐 Open Source',
  ];

  final Set<String> _selected = {};

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
                const _ProgressBar(step: 3, total: 6),
                const SizedBox(height: 24),

                Text('Your Interests',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                Text('Pick at least 3 topics you love',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 20),

                // Chip Grid
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Wrap(
                        spacing: 10,
                        runSpacing: 12,
                        children: _allInterests.map((tag) {
                          final on = _selected.contains(tag);
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                if (on) {
                                  _selected.remove(tag);
                                } else {
                                  _selected.add(tag);
                                }
                              });
                            },
                            child: NeumorphicBox(
                              color: on ? AppColors.accent : AppColors.background,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              borderRadius: 16,
                              child: Text(
                                tag,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: on ? Colors.white : AppColors.textPrimary,
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ),

                // Continue block
                const SizedBox(height: 16),
                Text('${_selected.length} selected (min 3)',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: _selected.length >= 3
                            ? AppColors.accent
                            : AppColors.textMuted)),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: _selected.length < 3
                      ? null
                      : () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SkillsPage()),
                          ),
                  child: Opacity(
                    opacity: _selected.length < 3 ? 0.5 : 1.0,
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
