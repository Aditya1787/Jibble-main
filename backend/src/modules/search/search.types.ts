/**
 * @file search.types.ts
 * @description Types for the Search module.
 */

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
}

export interface CircleSearchResult {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  type: string;
  membersCount: number;
}

export interface EventSearchResult {
  id: string;
  circleId: string | null;
  title: string;
  description: string | null;
  coverUrl: string | null;
  locationName: string | null;
  startsAt: string;
  joinLink: string | null;
}

export interface GroupSearchResult {
  id: string;
  circleId: string;
  name: string;
  description: string | null;
  iconName: string;
  membersCount: number;
}

export interface SearchAggregatedResponse {
  users: UserSearchResult[];
  circles: CircleSearchResult[];
  events: EventSearchResult[];
  groups: GroupSearchResult[];
}
