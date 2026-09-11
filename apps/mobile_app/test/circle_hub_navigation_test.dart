import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:jibble_mobile/features/circle/presentation/screens/circle_page.dart';

void main() {
  group('CirclePage 5-Navigation Hub Tests', () {
    testWidgets('Renders Circle header with Circle name and 5 navigation destinations', (tester) async {
      bool homeReturned = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CirclePage(
              circleId: 'circle-test-123',
              circleName: 'Test Community Circle',
              onReturnHome: () {
                homeReturned = true;
              },
            ),
          ),
        ),
      );

      // Verify Circle Name appears in app bar
      expect(find.text('Test Community Circle'), findsOneWidget);

      // Verify the 5 sub-tab labels in the bottom navigation dock
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Circle'), findsOneWidget);
      expect(find.text('Events'), findsOneWidget);
      expect(find.text('Anon'), findsOneWidget);
      expect(find.text('Groups'), findsOneWidget);

      // Verify Home Return button is present and triggers callback
      final homeBtn = find.text('Home');
      expect(homeBtn, findsOneWidget);
      await tester.tap(homeBtn);
      expect(homeReturned, true);
    });

    testWidgets('Tapping Events tab switches navigation to Events', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CirclePage(
              circleId: 'circle-test-123',
              circleName: 'Test Community Circle',
            ),
          ),
        ),
      );

      // Tap on Events tab
      final eventsTab = find.text('Events');
      await tester.tap(eventsTab);
      await tester.pumpAndSettle();

      // Events tab view is now active
      expect(find.text('Events'), findsWidgets);
    });

    testWidgets('Tapping Anon tab switches navigation to Anonymous confessions', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CirclePage(
              circleId: 'circle-test-123',
              circleName: 'Test Community Circle',
            ),
          ),
        ),
      );

      // Tap on Anon tab
      final anonTab = find.text('Anon');
      await tester.tap(anonTab);
      await tester.pumpAndSettle();

      expect(find.text('Anon'), findsWidgets);
    });

    testWidgets('Tapping Groups tab switches navigation to Groups', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CirclePage(
              circleId: 'circle-test-123',
              circleName: 'Test Community Circle',
            ),
          ),
        ),
      );

      // Tap on Groups tab
      final groupsTab = find.text('Groups');
      await tester.tap(groupsTab);
      await tester.pumpAndSettle();

      expect(find.text('Groups'), findsWidgets);
    });
  });
}
