import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../provider/auth_provider.dart';
import 'login_page.dart';

/// Register screen — GoRouter handles navigation away automatically.
/// When [authProvider] status becomes [AuthStatus.authenticated],
/// [RouterNotifier] fires GoRouter's redirect → user lands on /home.
class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _nameCtrl        = TextEditingController();
  final _emailCtrl       = TextEditingController();
  final _passCtrl        = TextEditingController();
  final _confirmPassCtrl = TextEditingController();
  bool  _obscurePass     = true;
  bool  _obscureConfirm  = true;

  void _signup() {
    final name     = _nameCtrl.text.trim();
    final email    = _emailCtrl.text.trim();
    final password = _passCtrl.text;
    final confirm  = _confirmPassCtrl.text;

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      _showSnack('Please fill in all fields.', error: true);
      return;
    }
    if (password != confirm) {
      _showSnack('Passwords do not match.', error: true);
      return;
    }
    if (password.length < 8) {
      _showSnack('Password must be at least 8 characters.', error: true);
      return;
    }

    ref.read(authProvider.notifier).signup(email, password, name);
  }

  void _showSnack(String msg, {bool error = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content:         Text(msg),
        backgroundColor: error ? Colors.red[700] : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // Show errors — GoRouter handles the /home redirect on authenticated state
    ref.listen<AuthState>(authProvider, (_, next) {
      if (next.status == AuthStatus.error && next.errorMessage != null) {
        _showSnack(next.errorMessage!, error: true);
      }
    });

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Branding ───────────────────────────────────────────
                Text(
                  'Jibble',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        fontFamily: 'Dancing_Script',
                        fontSize: 52,
                        fontWeight: FontWeight.w700,
                        color: Theme.of(context).colorScheme.primary,
                        letterSpacing: 1.5,
                      ),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'Your Campus, Your Vibe',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        letterSpacing: 1.1,
                        color: Colors.grey[500],
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),

                // ── Heading ────────────────────────────────────────────
                Text(
                  'Join Jibble',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),
                Text(
                  'Create an account and connect with your campus',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400],
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40),

                // ── Full name ──────────────────────────────────────────
                TextField(
                  controller:           _nameCtrl,
                  textInputAction:      TextInputAction.next,
                  textCapitalization:   TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText:  'Full Name',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                ),
                const SizedBox(height: 16),

                // ── Email ──────────────────────────────────────────────
                TextField(
                  controller:     _emailCtrl,
                  keyboardType:   TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText:  'Email',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                ),
                const SizedBox(height: 16),

                // ── Password ───────────────────────────────────────────
                TextField(
                  controller:      _passCtrl,
                  obscureText:     _obscurePass,
                  textInputAction: TextInputAction.next,
                  decoration: InputDecoration(
                    labelText:   'Password',
                    helperText:  'Min 8 chars, 1 uppercase, 1 number',
                    prefixIcon:  const Icon(Icons.lock_outline),
                    suffixIcon:  IconButton(
                      icon: Icon(
                        _obscurePass
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                      ),
                      onPressed: () =>
                          setState(() => _obscurePass = !_obscurePass),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // ── Confirm password ───────────────────────────────────
                TextField(
                  controller:      _confirmPassCtrl,
                  obscureText:     _obscureConfirm,
                  textInputAction: TextInputAction.done,
                  onSubmitted:     (_) => _signup(),
                  decoration: InputDecoration(
                    labelText:  'Confirm Password',
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureConfirm
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                      ),
                      onPressed: () =>
                          setState(() => _obscureConfirm = !_obscureConfirm),
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // ── Create account button ──────────────────────────────
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _signup,
                  child: authState.isLoading
                      ? const SizedBox(
                          height: 22, width: 22,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Create Account'),
                ),
                const SizedBox(height: 20),

                // ── Login link ─────────────────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Already have an account?',
                        style: TextStyle(color: Colors.grey[500])),
                    TextButton(
                      onPressed: () => Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (_) => const LoginPage()),
                      ),
                      child: const Text('Log in'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _confirmPassCtrl.dispose();
    super.dispose();
  }
}
