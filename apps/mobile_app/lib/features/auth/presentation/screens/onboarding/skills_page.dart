import 'package:flutter/material.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'username_page.dart';

class SkillsPage extends StatefulWidget {
  const SkillsPage({super.key});
  @override
  State<SkillsPage> createState() => _SkillsPageState();
}

class _SkillsPageState extends State<SkillsPage> {
  static const _allSkills = [
    'Flutter', 'React', 'Node.js', 'Python', 'Java', 'Kotlin', 'Swift',
    'TypeScript', 'Go', 'Rust', 'C++', 'Unity', 'Figma', 'Blender',
    'Photoshop', 'Illustrator', 'Machine Learning', 'Data Science',
    'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Firebase', 'PostgreSQL',
    'MongoDB', 'GraphQL', 'Blockchain', 'AR/VR', 'UI/UX Design',
    'Product Management',
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
                const _ProgressBar(step: 4, total: 6),
                const SizedBox(height: 24),

                const Text('Your Skills',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accentDark,
                    )),
                const SizedBox(height: 4),
                const Text('Add skills to connect with the right people',
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
                        children: _allSkills.map((skill) {
                          final on = _selected.contains(skill);
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                if (on) {
                                  _selected.remove(skill);
                                } else {
                                  _selected.add(skill);
                                }
                              });
                            },
                            child: NeumorphicBox(
                              color: on ? AppColors.accent : AppColors.background,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              borderRadius: 16,
                              child: Text(
                                skill,
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

                // Skip & Continue Neumorphic Buttons
                const SizedBox(height: 16),
                Text('${_selected.length} selected',
                    style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const UsernamePage()),
                      ),
                      child: const NeumorphicBox(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        borderRadius: 16,
                        child: Center(
                          child: Text(
                            'Skip',
                            style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const UsernamePage()),
                      ),
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
                ]),
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
