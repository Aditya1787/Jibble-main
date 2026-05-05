import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.accent,
      secondary: AppColors.purple,
      surface: AppColors.surface,
      error: AppColors.danger,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.surface,
      foregroundColor: AppColors.textPrimary,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        color: AppColors.textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.surface,
      selectedItemColor: AppColors.accent,
      unselectedItemColor: AppColors.textMuted,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
    ),
    fontFamily: 'Inter',
    textTheme: const TextTheme(
      headlineLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800),
      headlineMedium: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700),
      titleLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700),
      titleMedium: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(color: AppColors.textSecondary),
      bodyMedium: TextStyle(color: AppColors.textSecondary),
      labelSmall: TextStyle(color: AppColors.textMuted),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.card,
      hintStyle: const TextStyle(color: AppColors.textMuted),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.accent, width: 1.5),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.accent,
        foregroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
      ),
    ),
  );
}
