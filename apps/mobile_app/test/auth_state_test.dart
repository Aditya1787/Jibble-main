import 'package:flutter_test/flutter_test.dart';
import 'package:jibble_mobile/features/auth/data/models/user_model.dart';

void main() {
  group('UserModel Role & Account Type Tests', () {
    test('Default user has USER accountType and is not creator or circle community', () {
      const user = UserModel(
        id: 'u-1',
        email: 'user@jibble.app',
        status: 'active',
        provider: 'local',
        emailVerified: true,
      );

      expect(user.accountType, 'USER');
      expect(user.isCreator, false);
      expect(user.isCircleCommunity, false);
    });

    test('Creator accountType or role correctly identifies as creator', () {
      const creatorUser = UserModel(
        id: 'c-1',
        email: 'creator@jibble.app',
        status: 'active',
        provider: 'local',
        emailVerified: true,
        accountType: 'CREATOR',
        roles: ['USER', 'CREATOR'],
      );

      expect(creatorUser.isCreator, true);
      expect(creatorUser.isCircleCommunity, false);
    });

    test('Circle Community account is strictly identified for quarantine', () {
      const communityUser = UserModel(
        id: 'comm-1',
        email: 'tech_club@jibble.app',
        status: 'active',
        provider: 'local',
        emailVerified: true,
        accountType: 'CIRCLE_COMMUNITY',
        activeCircleId: 'circle-uuid-1',
      );

      expect(communityUser.isCircleCommunity, true);
      expect(communityUser.isCreator, false);
      expect(communityUser.activeCircleId, 'circle-uuid-1');
    });

    test('fromJson parses snake_case account_type from backend correctly', () {
      final json = {
        'id': 'u-2',
        'email': 'parsed@jibble.app',
        'status': 'active',
        'provider': 'local',
        'emailVerified': true,
        'account_type': 'CIRCLE_COMMUNITY',
        'active_circle_id': 'circle-99',
        'roles': ['CIRCLE_ADMIN'],
      };

      final parsed = UserModel.fromJson(json);
      expect(parsed.accountType, 'CIRCLE_COMMUNITY');
      expect(parsed.isCircleCommunity, true);
      expect(parsed.activeCircleId, 'circle-99');
      expect(parsed.roles, contains('CIRCLE_ADMIN'));
    });

    test('copyWith updates accountType seamlessly for creator mode switch', () {
      const original = UserModel(
        id: 'u-3',
        email: 'switch@jibble.app',
        status: 'active',
        provider: 'local',
        emailVerified: true,
        accountType: 'USER',
      );

      final upgraded = original.copyWith(
        accountType: 'CREATOR',
        roles: ['USER', 'CREATOR'],
      );

      expect(upgraded.accountType, 'CREATOR');
      expect(upgraded.isCreator, true);
      expect(upgraded.id, original.id);
      expect(upgraded.email, original.email);
    });
  });
}
