import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFFF3EFE8);
  static const Color surface    = Color(0x99F3EFE8);
  static const Color card       = Color(0x73FFFFFF);
  static const Color cardHover  = Color(0x99FFFFFF);

  static const Color accent     = Color(0xFF336659);
  static const Color accentLight= Color(0xFF487C6F);
  static const Color accentDark = Color(0xFF1F493D);
  static const Color whiteEdge  = Color(0xFFFFFFFF);

  static const Color success    = Color(0xFF336659);
  static const Color warning    = Color(0xFFC28D38);
  static const Color danger     = Color(0xFFB34A4A);

  static const Color textPrimary   = Color(0xFF3D3D3D);
  static const Color textSecondary = Color(0xFF656158);
  static const Color textMuted     = Color(0xFF958F83);

  static const Color border     = Color(0x1A3D3D3D);

  static const LinearGradient accentGradient = LinearGradient(
    colors: [accent, accentDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
