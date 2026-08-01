import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';

import 'package:jibble_mobile/shared/presentation/widgets/neumorphic_box.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';
import 'onboarding/college_page.dart';
import 'login_page.dart';

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

  String get _otpCode => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    }
    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    if (_otpCode.length == 6) {
      _verify();
    }
  }

  Future<void> _verify() async {
    if (_isVerifying || _otpCode.length < 6) return;

    setState(() => _isVerifying = true);
    await Future.delayed(const Duration(milliseconds: 800));

    if (!mounted) return;
    setState(() => _isVerifying = false);

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const CollegePage()),
      (_) => false,
    );
  }

  Future<void> _resend() async {
    if (!_canResend) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('OTP resent to ${widget.email}', style: const TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: AppColors.accent,
      ),
    );
    _startCountdown();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                NeumorphicBox(
                  borderRadius: 28,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Elevated Icon Plate
                      const NeumorphicBox(
                        shape: BoxShape.circle,
                        padding: EdgeInsets.all(18),
                        child: Icon(
                          Icons.mark_email_read_rounded,
                          size: 36,
                          color: AppColors.accent,
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Title
                      const Text(
                        'Verify Your Email',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accentDark,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'We sent a 6-digit code to',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.email,
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),

                      // OTP input boxes
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
                      const SizedBox(height: 32),

                      // Helper box
                      const NeumorphicBox(
                        isRecessed: true,
                        borderRadius: 14,
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('💡 Verification Code: ', style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('123456', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Neumorphic action button
                      GestureDetector(
                        onTap: (_isVerifying || _otpCode.length < 6) ? null : _verify,
                        child: NeumorphicBox(
                          color: AppColors.accent,
                          borderRadius: 16,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          child: Center(
                            child: _isVerifying
                                ? const SizedBox(
                                    height: 22,
                                    width: 22,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.5,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Text(
                                    'Verify Email',
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
                      const SizedBox(height: 24),

                      // Resend
                      TextButton(
                        onPressed: _canResend ? _resend : null,
                        child: Text(
                          _canResend
                              ? 'Resend OTP'
                              : 'Resend in $_countdown seconds',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: _canResend
                                ? AppColors.accent
                                : AppColors.textMuted,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Back to login
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pushAndRemoveUntil(
                            MaterialPageRoute(builder: (_) => const LoginPage()),
                            (_) => false,
                          );
                        },
                        child: const Text(
                          'Wrong email? Go back',
                          style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

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
    return NeumorphicBox(
      isRecessed: true,
      borderRadius: 12,
      padding: EdgeInsets.zero,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      child: SizedBox(
        width: 44,
        height: 52,
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          autofocus: autofocus,
          textAlign: TextAlign.center,
          keyboardType: TextInputType.number,
          maxLength: 1,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: AppColors.textPrimary),
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          onChanged: onChanged,
          decoration: const InputDecoration(
            counterText: '',
            contentPadding: EdgeInsets.zero,
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
          ),
        ),
      ),
    );
  }
}
