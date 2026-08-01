import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import '../provider/auth_provider.dart';
import 'login_page.dart';

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
        content: Text(msg, style: const TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: error ? AppColors.danger : AppColors.accent,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    ref.listen<AuthState>(authProvider, (_, next) {
      if (next.status == AuthStatus.error && next.errorMessage != null) {
        _showSnack(next.errorMessage!, error: true);
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Branding
                Text(
                  'Jibble',
                  style: TextStyle(
                    fontFamily: 'Dancing_Script',
                    fontSize: 56,
                    fontWeight: FontWeight.w800,
                    color: AppColors.accent,
                    letterSpacing: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                Text(
                  'Your Campus, Your Vibe',
                  style: TextStyle(
                    letterSpacing: 1.1,
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 36),

                // Main Neumorphic Card Plate
                NeumorphicBox(
                  borderRadius: 28,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Heading
                      Text(
                        'Join Jibble',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accentDark,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Create an account and connect with your campus',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),

                      // Full Name Recessed Box
                      NeumorphicBox(
                        isRecessed: true,
                        borderRadius: 16,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: TextField(
                          controller: _nameCtrl,
                          textInputAction: TextInputAction.next,
                          textCapitalization: TextCapitalization.words,
                          style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            labelText: 'Full Name',
                            floatingLabelBehavior: FloatingLabelBehavior.auto,
                            prefixIcon: Icon(Icons.person_outline, color: AppColors.textMuted),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Email Recessed Box
                      NeumorphicBox(
                        isRecessed: true,
                        borderRadius: 16,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: TextField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                          style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            labelText: 'Email',
                            floatingLabelBehavior: FloatingLabelBehavior.auto,
                            prefixIcon: Icon(Icons.email_outlined, color: AppColors.textMuted),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Password Recessed Box
                      NeumorphicBox(
                        isRecessed: true,
                        borderRadius: 16,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: TextField(
                          controller: _passCtrl,
                          obscureText: _obscurePass,
                          textInputAction: TextInputAction.next,
                          style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            labelText: 'Password',
                            floatingLabelBehavior: FloatingLabelBehavior.auto,
                            helperText: 'Min 8 chars, 1 uppercase, 1 number',
                            helperStyle: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold, fontSize: 11),
                            prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textMuted),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePass
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                color: AppColors.textMuted,
                              ),
                              onPressed: () =>
                                  setState(() => _obscurePass = !_obscurePass),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Confirm Password Recessed Box
                      NeumorphicBox(
                        isRecessed: true,
                        borderRadius: 16,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: TextField(
                          controller: _confirmPassCtrl,
                          obscureText: _obscureConfirm,
                          textInputAction: TextInputAction.done,
                          onSubmitted: (_) => _signup(),
                          style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            labelText: 'Confirm Password',
                            floatingLabelBehavior: FloatingLabelBehavior.auto,
                            prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textMuted),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscureConfirm
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                color: AppColors.textMuted,
                              ),
                              onPressed: () =>
                                  setState(() => _obscureConfirm = !_obscureConfirm),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Neumorphic Green Button
                      GestureDetector(
                        onTap: authState.isLoading ? null : _signup,
                        child: NeumorphicBox(
                          color: AppColors.accent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          borderRadius: 16,
                          child: Center(
                            child: authState.isLoading
                                ? const SizedBox(
                                    height: 22, width: 22,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2.5, color: Colors.white),
                                  )
                                : const Text(
                                    'Create Account',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Login Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Already have an account?',
                        style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold, fontSize: 13)),
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                              builder: (_) => const LoginPage()),
                        );
                      },
                      child: const Text(
                        'Log in',
                        style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.accent),
                      ),
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
