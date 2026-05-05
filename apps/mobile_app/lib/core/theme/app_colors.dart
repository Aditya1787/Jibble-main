import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0A0F1E);
  static const Color surface    = Color(0xFF111827);
  static const Color card       = Color(0xFF1A2235);
  static const Color cardHover  = Color(0xFF1E2D45);

  static const Color accent     = Color(0xFF6C63FF);
  static const Color accentLight= Color(0xFF8B85FF);
  static const Color purple     = Color(0xFFA855F7);

  static const Color success    = Color(0xFF10B981);
  static const Color warning    = Color(0xFFF59E0B);
  static const Color danger     = Color(0xFFEF4444);

  static const Color textPrimary   = Color(0xFFF1F5F9);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted     = Color(0xFF64748B);

  static const Color border     = Color(0x12FFFFFF);

  static const LinearGradient accentGradient = LinearGradient(
    colors: [accent, purple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
