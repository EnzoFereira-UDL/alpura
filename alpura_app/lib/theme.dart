import 'package:flutter/material.dart';

class AlpuraTheme {
  static const Color blueDark = Color(0xFF1A2B6B);
  static const Color blueLight = Color(0xFF00AEEF);
  static const Color greenAccent = Color(0xFF66B22E);
  static const Color bgLight = Color(0xFFF4F6FB);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: bgLight,
      colorScheme: ColorScheme.fromSeed(
        seedColor: blueDark,
        primary: blueDark,
        secondary: blueLight,
        tertiary: greenAccent,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: blueDark,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }
}