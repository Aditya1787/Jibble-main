import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'profile_picture_page.dart';

/// Onboarding step 5 — User picks a unique username.
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _ProgressBar(step: 5, total: 6),
              const SizedBox(height: 32),
              Text('Choose a Username',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary)),
              const SizedBox(height: 6),
              Text('Your unique handle on Jibble',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[400])),
              const SizedBox(height: 40),
              TextField(
                controller: _ctrl,
                onChanged: _validate,
                textInputAction: TextInputAction.done,
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z0-9_.]')),
                  LengthLimitingTextInputFormatter(30),
                ],
                decoration: InputDecoration(
                  labelText: 'Username',
                  prefixText: '@',
                  prefixIcon: const Icon(Icons.alternate_email_rounded),
                  errorText: _error,
                  suffixIcon: _valid
                      ? Icon(Icons.check_circle_rounded,
                          color: Theme.of(context).colorScheme.primary)
                      : null,
                ),
              ),
              const SizedBox(height: 8),
              Text('Lowercase letters, numbers, underscores and dots only.',
                  style: TextStyle(fontSize: 12, color: Colors.grey[500])),
              const Spacer(),
              ElevatedButton(
                onPressed: !_valid
                    ? null
                    : () => Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => const ProfilePicturePage())),
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
