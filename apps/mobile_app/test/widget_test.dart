import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jibble_mobile/main.dart';

void main() {
  testWidgets('JibbleApp boots within ProviderScope without crashing', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: JibbleApp(),
      ),
    );

    // Initial pump
    expect(find.byType(JibbleApp), findsOneWidget);
  });
}
