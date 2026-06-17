import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';

import 'auth_gate.dart';
import 'login_page.dart';

/// OTP Verification page.
///
/// Shown after signup when email OTP verification is required.
/// Accepts a 6-digit code sent to [email] and calls the verification API.
/// Also supports resending the code with a 60-second cooldown timer.
class OtpVerificationPage extends ConsumerStatefulWidget {
  final String email;
  const OtpVerificationPage({super.key, required this.email});

  @override
  ConsumerState<OtpVerificationPage> createState() =>
      _OtpVerificationPageState();
}

class _OtpVerificationPageState extends ConsumerState<OtpVerificationPage> {
  final List<TextEditingController> _controllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());

  bool _isVerifying = false;
  bool _canResend = false;
  int _countdown = 60;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  // ── Timer ──────────────────────────────────────────────────────────────────

  void _startCountdown() {
    setState(() {
      _canResend = false;
      _countdown = 60;
    });
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) {
        t.cancel();
        return;
      }
      setState(() {
        if (_countdown > 0) {
          _countdown--;
        } else {
          _canResend = true;
          t.cancel();
        }
      });
    });
  }

  // ── OTP logic ──────────────────────────────────────────────────────────────

  String get _otpCode => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    }
    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    // Auto-submit when all 6 digits are filled
    if (_otpCode.length == 6) {
      _verify();
    }
  }

  Future<void> _verify() async {
    if (_isVerifying || _otpCode.length < 6) return;

    setState(() => _isVerifying = true);

    // TODO: Call actual OTP verify API once backend OTP flow is implemented.
    // For now (auto-verified during signup), just navigate to home.
    await Future.delayed(const Duration(milliseconds: 800));

    if (!mounted) return;
    setState(() => _isVerifying = false);

    // Navigate to home
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const AuthGate()),
      (_) => false,
    );
  }

  Future<void> _resend() async {
    if (!_canResend) return;

    // TODO: Call resend OTP API endpoint
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('OTP resent to ${widget.email}'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
    );
    _startCountdown();
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),

              // ── Icon ────────────────────────────────────────────────────
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(context)
                          .colorScheme
                          .primary
                          .withOpacity(0.4),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.mark_email_read_rounded,
                  size: 40,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 32),

              // ── Title ───────────────────────────────────────────────────
              Text(
                'Verify Your Email',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              Text(
                'We sent a 6-digit code to',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.grey[400],
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                widget.email,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),

              // ── OTP input boxes ─────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(6, (i) {
                  return _OtpBox(
                    controller: _controllers[i],
                    focusNode: _focusNodes[i],
                    onChanged: (v) => _onDigitChanged(i, v),
                    autofocus: i == 0,
                  );
                }),
              ),
              const SizedBox(height: 40),

              // ── Verify button ───────────────────────────────────────────
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: (_isVerifying || _otpCode.length < 6)
                      ? null
                      : _verify,
                  child: _isVerifying
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Verify Email'),
                ),
              ),
              const SizedBox(height: 24),

              // ── Resend ──────────────────────────────────────────────────
              TextButton(
                onPressed: _canResend ? _resend : null,
                child: Text(
                  _canResend
                      ? 'Resend OTP'
                      : 'Resend in $_countdown seconds',
                  style: TextStyle(
                    color: _canResend
                        ? Theme.of(context).colorScheme.primary
                        : Colors.grey[500],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ── Back to login ───────────────────────────────────────────
              TextButton(
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const LoginPage()),
                    (_) => false,
                  );
                },
                child: Text(
                  'Wrong email? Go back',
                  style: TextStyle(color: Colors.grey[500]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Single OTP digit box ───────────────────────────────────────────────────────

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;
  final bool autofocus;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.onChanged,
    this.autofocus = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 56,
      margin: const EdgeInsets.symmetric(horizontal: 5),
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        autofocus: autofocus,
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        maxLength: 1,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        onChanged: onChanged,
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
        decoration: InputDecoration(
          counterText: '',
          contentPadding: EdgeInsets.zero,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide:
                BorderSide(color: Theme.of(context).colorScheme.surface),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color:
                  Theme.of(context).colorScheme.primary.withOpacity(0.3),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: Theme.of(context).colorScheme.primary,
              width: 2,
            ),
          ),
        ),
      ),
    );
  }
}
