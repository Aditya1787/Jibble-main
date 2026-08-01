import 'package:flutter/material.dart';
import 'skills_page.dart';

/// Onboarding step 3 — User selects their interests.
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _ProgressBar(step: 3, total: 6),
              const SizedBox(height: 32),

              Text('Your Interests',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      )),
              const SizedBox(height: 6),
              Text('Pick at least 3 topics you love',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400])),
              const SizedBox(height: 24),

              // ── Chip grid ─────────────────────────────────────────────
              Expanded(
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing:  10,
                    runSpacing: 10,
                    children: _allInterests.map((tag) {
                      final on = _selected.contains(tag);
                      return FilterChip(
                        label:     Text(tag),
                        selected:  on,
                        onSelected: (_) => setState(() {
                          if (on) _selected.remove(tag);
                          else    _selected.add(tag);
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

              // ── Count & continue ──────────────────────────────────────
              const SizedBox(height: 16),
              Text('${_selected.length} selected (min 3)',
                  style: TextStyle(
                      color: _selected.length >= 3
                          ? Theme.of(context).colorScheme.primary
                          : Colors.grey[500])),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _selected.length < 3
                    ? null
                    : () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const SkillsPage()),
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
