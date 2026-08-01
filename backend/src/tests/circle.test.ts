/**
 * @file circle.test.ts
 * @description Unit tests for Jibble Circle (Community) services, admin approvals, and 10 components.
 */

jest.mock('../modules/circle/circle.repository');
jest.mock('../modules/profile/profile.repository');

import { circleService } from '../modules/circle/circle.service';
import { circleRepository } from '../modules/circle/circle.repository';
import { profileRepository } from '../modules/profile/profile.repository';

const mockCircleRepo = circleRepository as jest.Mocked<typeof circleRepository>;
const mockProfileRepo = profileRepository as jest.Mocked<typeof profileRepository>;

const MOCK_PROFILE = {
  id: 'profile-uuid-1',
  user_id: 'user-uuid-1',
  username: 'alex_campus',
  display_name: 'Alex Campus',
  bio: 'Student',
  avatar_url: 'http://avatar.com/alex.jpg',
  college_id: 'college-uuid-1',
  department: 'Computer Science',
  created_at: new Date(),
  updated_at: new Date(),
};

const MOCK_PENDING_CIRCLE_ROW = {
  id: 'circle-uuid-1',
  name: 'Robotics & AI Club',
  slug: 'robotics-ai-club-1234',
  description: 'AI enthusiast community',
  avatar_url: null,
  banner_url: null,
  type: 'interest' as const,
  status: 'pending' as const,
  college_id: 'college-uuid-1',
  created_by: 'user-uuid-1',
  is_private: false,
  members_count: 1,
  rejection_reason: null,
  created_at: new Date(),
  updated_at: new Date(),
  user_role: 'owner' as const,
};

const MOCK_APPROVED_CIRCLE_ROW = {
  ...MOCK_PENDING_CIRCLE_ROW,
  status: 'approved' as const,
};

const MOCK_COMPONENT_ROWS = [
  {
    id: 'cc-1',
    circle_id: 'circle-uuid-1',
    component_key: 'anonymous',
    is_enabled: true,
    custom_name: 'Campus Confessions',
    settings: null,
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date(),
    template_name: 'Anonymous Confessions',
    template_description: 'Share thoughts anonymously',
    template_icon: 'lock_outline',
  },
  {
    id: 'cc-2',
    circle_id: 'circle-uuid-1',
    component_key: 'events',
    is_enabled: true,
    custom_name: null,
    settings: null,
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date(),
    template_name: 'Events & Meetups',
    template_description: 'Host and discover events',
    template_icon: 'event',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('circleService.requestCircle', () => {
  it('creates community request with pending status for general interest circles', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(MOCK_PROFILE as any);
    mockCircleRepo.createCircle.mockResolvedValue(MOCK_PENDING_CIRCLE_ROW as any);

    const result = await circleService.requestCircle('user-uuid-1', {
      name: 'Robotics & AI Club',
      type: 'interest',
      description: 'AI enthusiast community',
    });

    expect(mockProfileRepo.findByUserId).toHaveBeenCalledWith('user-uuid-1');
    expect(mockCircleRepo.createCircle).toHaveBeenCalledWith(
      'user-uuid-1',
      expect.objectContaining({ name: 'Robotics & AI Club', type: 'interest' }),
      'pending'
    );
    expect(result.status).toBe('pending');
    expect(result.name).toBe('Robotics & AI Club');
  });

  it('throws error if user profile does not exist', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(null);

    await expect(
      circleService.requestCircle('user-uuid-1', {
        name: 'Robotics & AI Club',
      })
    ).rejects.toMatchObject({
      code: 'PROFILE_REQUIRED',
      statusCode: 400,
    });
  });
});

describe('circleService.approveCircle & rejectCircle', () => {
  it('approves a pending circle request', async () => {
    mockCircleRepo.findById.mockResolvedValue(MOCK_PENDING_CIRCLE_ROW as any);
    mockCircleRepo.approveCircle.mockResolvedValue(MOCK_APPROVED_CIRCLE_ROW as any);

    const result = await circleService.approveCircle('circle-uuid-1');

    expect(mockCircleRepo.approveCircle).toHaveBeenCalledWith('circle-uuid-1');
    expect(result.status).toBe('approved');
  });

  it('rejects a pending circle request with reason', async () => {
    mockCircleRepo.findById.mockResolvedValue(MOCK_PENDING_CIRCLE_ROW as any);
    mockCircleRepo.rejectCircle.mockResolvedValue({
      ...MOCK_PENDING_CIRCLE_ROW,
      status: 'rejected',
      rejection_reason: 'Duplicate community',
    } as any);

    const result = await circleService.rejectCircle('circle-uuid-1', 'Duplicate community');

    expect(mockCircleRepo.rejectCircle).toHaveBeenCalledWith('circle-uuid-1', 'Duplicate community');
    expect(result.status).toBe('rejected');
    expect(result.rejectionReason).toBe('Duplicate community');
  });
});

describe('circleService.getUserCircleConfig', () => {
  it('returns circle config with enabled components for primary approved circle', async () => {
    mockCircleRepo.getUserPrimaryCircle.mockResolvedValue(MOCK_APPROVED_CIRCLE_ROW as any);
    mockCircleRepo.getMemberRole.mockResolvedValue('owner');
    mockCircleRepo.getCircleComponents.mockResolvedValue(MOCK_COMPONENT_ROWS as any);

    const config = await circleService.getUserCircleConfig('user-uuid-1');

    expect(config.circle.id).toBe('circle-uuid-1');
    expect(config.userRole).toBe('owner');
    expect(config.enabledComponents.length).toBe(2);
    expect(config.enabledComponents[0].displayName).toBe('Campus Confessions');
  });
});

describe('circleService.toggleComponent', () => {
  it('allows circle owner to update component configuration', async () => {
    mockCircleRepo.getMemberRole.mockResolvedValue('owner');
    mockCircleRepo.updateComponent.mockResolvedValue({
      ...MOCK_COMPONENT_ROWS[0],
      custom_name: 'Secret Confessions',
    } as any);

    const result = await circleService.toggleComponent(
      'circle-uuid-1',
      'user-uuid-1',
      'anonymous',
      { customName: 'Secret Confessions' }
    );

    expect(mockCircleRepo.updateComponent).toHaveBeenCalledWith('circle-uuid-1', 'anonymous', {
      customName: 'Secret Confessions',
    });
    expect(result.customName).toBe('Secret Confessions');
  });

  it('throws forbidden error if non-admin tries to toggle component', async () => {
    mockCircleRepo.getMemberRole.mockResolvedValue('member');

    await expect(
      circleService.toggleComponent('circle-uuid-1', 'user-uuid-2', 'anonymous', { isEnabled: false })
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403,
    });
  });
});
