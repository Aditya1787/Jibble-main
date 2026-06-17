import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'date_of_birth_page.dart';

/// Onboarding step 1 — User picks their college.
///
/// In a full build this list comes from GET /api/v1/colleges.
/// For now, uses a static placeholder list to demonstrate the UI.
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
    'IIIT Allahabad', 'PSG College of Technology', 'COEP Pune', 'RVCE Bangalore',
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Progress ─────────────────────────────────────────────
              _ProgressBar(step: 1, total: 6),
              const SizedBox(height: 32),

              // ── Heading ───────────────────────────────────────────────
              Text('Your College',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      )),
              const SizedBox(height: 6),
              Text('Search and select your institution',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400])),
              const SizedBox(height: 24),

              // ── Search ────────────────────────────────────────────────
              TextField(
                controller: _searchCtrl,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  hintText:  'Search colleges...',
                  prefixIcon: Icon(Icons.search_rounded),
                ),
              ),
              const SizedBox(height: 16),

              // ── College list ──────────────────────────────────────────
              Expanded(
                child: ListView.builder(
                  itemCount: _filtered.length,
                  itemBuilder: (_, i) {
                    final name     = _filtered[i];
                    final selected = name == _selectedCollege;
                    return ListTile(
                      onTap: () => setState(() => _selectedCollege = name),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      tileColor: selected
                          ? Theme.of(context).colorScheme.primary.withOpacity(0.12)
                          : null,
                      leading: Icon(
                        Icons.school_rounded,
                        color: selected
                            ? Theme.of(context).colorScheme.primary
                            : Colors.grey[500],
                      ),
                      title: Text(name,
                          style: TextStyle(
                            fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                            color: selected
                                ? Theme.of(context).colorScheme.primary
                                : null,
                          )),
                      trailing: selected
                          ? Icon(Icons.check_circle_rounded,
                              color: Theme.of(context).colorScheme.primary)
                          : null,
                    );
                  },
                ),
              ),

              // ── Next button ───────────────────────────────────────────
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _selectedCollege == null
                    ? null
                    : () => Navigator.of(context).push(
                          MaterialPageRoute(
                              builder: (_) => const DateOfBirthPage()),
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

// Shared progress indicator for onboarding steps
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
            height:  4,
            margin:  EdgeInsets.only(right: i < total - 1 ? 4 : 0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(2),
              color: active
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).colorScheme.surface,
            ),
          ),
        );
      }),
    );
  }
}
