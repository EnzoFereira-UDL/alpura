import 'package:flutter/material.dart';
import 'theme.dart';
import 'home_screen.dart';

void main() {
  runApp(const AlpuraApp());
}

class AlpuraApp extends StatelessWidget {
  const AlpuraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Alpura App',
      debugShowCheckedModeBanner: false,
      theme: AlpuraTheme.lightTheme,
      home: const HomeScreen(),
    );
  }
}