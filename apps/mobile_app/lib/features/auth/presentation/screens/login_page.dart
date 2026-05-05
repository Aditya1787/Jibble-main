import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../home/presentation/screens/main_shell.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _obscure = true;
  bool _loading = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  void _login() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainShell()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 40),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              // Logo
              Row(
                children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      gradient: AppColors.accentGradient,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(child: Text('J', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white))),
                  ),
                  const SizedBox(width: 12),
                  const Text('Jibble', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                ],
              ),
              const SizedBox(height: 48),
              const Text('Welcome back 👋', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              const Text('Sign in to your college account', style: TextStyle(fontSize: 15, color: AppColors.textSecondary)),
              const SizedBox(height: 40),

              // Email
              _label('College Email'),
              const SizedBox(height: 8),
              TextField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: const InputDecoration(
                  hintText: 'you@college.ac.in',
                  prefixIcon: Icon(Icons.email_outlined, color: AppColors.textMuted, size: 20),
                ),
              ),
              const SizedBox(height: 20),

              // Password
              _label('Password'),
              const SizedBox(height: 8),
              TextField(
                controller: _passCtrl,
                obscureText: _obscure,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  hintText: '••••••••',
                  prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textMuted, size: 20),
                  suffixIcon: IconButton(
                    onPressed: () => setState(() => _obscure = !_obscure),
                    icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppColors.textMuted, size: 20),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {},
                  child: const Text('Forgot Password?', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(height: 24),

              // Login button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _login,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: _loading
                    ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                    : const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 28),

              // Divider
              Row(
                children: [
                  Expanded(child: Divider(color: AppColors.border, thickness: 1)),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text('or continue with', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                  ),
                  Expanded(child: Divider(color: AppColors.border, thickness: 1)),
                ],
              ),
              const SizedBox(height: 24),

              // Google button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _login,
                  icon: const Text('G', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF4285F4))),
                  label: const Text('Sign in with Google', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600)),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Sign up
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text("Don't have an account? ", style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                    GestureDetector(
                      onTap: () {},
                      child: const Text('Sign Up', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w700, fontSize: 14)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary));
}
