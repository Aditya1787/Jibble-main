import 'package:flutter/material.dart';

import 'login_page.dart';

/// Forgot Password screen — collects the user's email and sends a reset link.
///
/// The actual reset email is sent by POST /api/v1/auth/forgot-password
/// (to be wired in the next sprint). The UI is complete and ready.
class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _emailCtrl = TextEditingController();
  bool _submitted  = false;
  bool _loading    = false;

  Future<void> _submit() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email address.')),
      );
      return;
    }

    setState(() => _loading = true);
    // TODO: call POST /api/v1/auth/forgot-password
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() { _loading = false; _submitted = true; });
  }

  @override
  void dispose() { _emailCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reset Password'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: _submitted ? _successView() : _formView(),
        ),
      ),
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  Widget _formView() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),

          // Icon
          Container(
            width: 72, height: 72,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(Icons.lock_reset_rounded,
                size: 36, color: Theme.of(context).colorScheme.primary),
          ),
          const SizedBox(height: 28),

          Text('Forgot Password?',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  )),
          const SizedBox(height: 8),
          Text(
            "Enter your email and we'll send you a link to reset your password.",
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[400]),
          ),
          const SizedBox(height: 36),

          TextField(
            controller: _emailCtrl,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
            decoration: const InputDecoration(
              labelText: 'Email Address',
              prefixIcon: Icon(Icons.email_outlined),
            ),
          ),
          const SizedBox(height: 24),

          ElevatedButton(
            onPressed: _loading ? null : _submit,
            child: _loading
                ? const SizedBox(
                    height: 22, width: 22,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: Colors.white))
                : const Text('Send Reset Link'),
          ),
          const SizedBox(height: 16),

          Center(
            child: TextButton(
              onPressed: () => Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const LoginPage()),
              ),
              child: const Text('Back to Login'),
            ),
          ),
        ],
      );

  // ── Success ───────────────────────────────────────────────────────────────

  Widget _successView() => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(Icons.mark_email_read_rounded,
              size: 80,
              color: Theme.of(context).colorScheme.primary),
          const SizedBox(height: 24),
          Text('Check Your Inbox',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Text(
            'We sent a password reset link to\n${_emailCtrl.text.trim()}',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[400]),
          ),
          const SizedBox(height: 40),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (_) => const LoginPage()),
              (_) => false,
            ),
            child: const Text('Back to Login'),
          ),
        ],
      );
}
