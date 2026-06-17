import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../provider/auth_provider.dart';
import 'register_page.dart';
import 'forgot_password_page.dart';

/// Login screen — GoRouter handles navigation away automatically.
/// When [authProvider] status becomes [AuthStatus.authenticated],
/// [RouterNotifier] fires GoRouter's redirect → user lands on /home.
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _emailCtrl    = TextEditingController();
  final _passCtrl     = TextEditingController();
  bool  _obscurePass  = true;

  void _login() {
    final email    = _emailCtrl.text.trim();
    final password = _passCtrl.text;

    if (email.isEmpty || password.isEmpty) {
      _showSnack('Please fill in all fields.');
      return;
    }

    ref.read(authProvider.notifier).login(email, password);
  }

  void _showSnack(String msg, {bool error = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
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
                  'Welcome Back',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),
                Text(
                  'Sign in to continue your campus journey',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[400],
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40),

                // ── Email ──────────────────────────────────────────────
                TextField(
                  controller:     _emailCtrl,
                  keyboardType:   TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText:   'Email',
                    prefixIcon:  Icon(Icons.email_outlined),
                  ),
                ),
                const SizedBox(height: 16),

                // ── Password ───────────────────────────────────────────
                TextField(
                  controller:      _passCtrl,
                  obscureText:     _obscurePass,
                  textInputAction: TextInputAction.done,
                  onSubmitted:     (_) => _login(),
                  decoration: InputDecoration(
                    labelText:  'Password',
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
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
                const SizedBox(height: 4),

                // ── Forgot password ────────────────────────────────────
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(
                          builder: (_) => const ForgotPasswordPage()),
                    ),
                    child: Text(
                      'Forgot password?',
                      style: TextStyle(
                        color:    Theme.of(context).colorScheme.primary,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // ── Login button ───────────────────────────────────────
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _login,
                  child: authState.isLoading
                      ? const SizedBox(
                          height: 22, width: 22,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Log In'),
                ),
                const SizedBox(height: 20),

                // ── Sign-up link ───────────────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Don't have an account?",
                        style: TextStyle(color: Colors.grey[500])),
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                              builder: (_) => const RegisterPage()),
                        );
                      },
                      child: const Text('Sign up'),
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
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }
}
