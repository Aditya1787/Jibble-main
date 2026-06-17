import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  // ProviderScope MUST wrap the entire app so all Riverpod
  // ConsumerWidgets can resolve their providers.
  runApp(
    const ProviderScope(
      child: JibbleApp(),
    ),
  );
}

class JibbleApp extends ConsumerWidget {
  const JibbleApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // The router is created once and held by a Provider.
    // RouterNotifier inside it listens to authProvider and
    // triggers GoRouter's redirect on every auth state change.
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Jibble',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
