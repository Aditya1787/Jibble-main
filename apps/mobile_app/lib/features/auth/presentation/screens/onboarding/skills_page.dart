import 'package:flutter/material.dart';
import 'username_page.dart';

/// Onboarding step 4 — User selects their skills.
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _ProgressBar(step: 4, total: 6),
              const SizedBox(height: 32),

              Text('Your Skills',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      )),
              const SizedBox(height: 6),
              Text('Add skills to connect with the right people',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400])),
              const SizedBox(height: 24),

              Expanded(
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 10, runSpacing: 10,
                    children: _allSkills.map((skill) {
                      final on = _selected.contains(skill);
                      return FilterChip(
                        label:     Text(skill),
                        selected:  on,
                        onSelected: (_) => setState(() {
                          if (on) _selected.remove(skill);
                          else    _selected.add(skill);
                        }),
                        selectedColor:
                            Theme.of(context).colorScheme.primary.withOpacity(0.2),
                        checkmarkColor:
                            Theme.of(context).colorScheme.primary,
                        side: BorderSide(
                          color: on
                              ? Theme.of(context).colorScheme.primary
                              : Colors.white12,
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              const SizedBox(height: 16),
              Text('${_selected.length} selected',
                  style: TextStyle(color: Colors.grey[500])),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const UsernamePage()),
                    ),
                    child: const Text('Skip'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const UsernamePage()),
                    ),
                    child: const Text('Continue'),
                  ),
                ),
              ]),
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
            height: 4, margin: EdgeInsets.only(right: i < total - 1 ? 4 : 0),
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
