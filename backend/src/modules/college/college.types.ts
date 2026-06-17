/**
 * @file college.types.ts
 * @description College module types/DTOs.
 *              PRD: "Searchable list of colleges/organizations"
 */

export interface CollegeRow {
  id: string;
  name: string;
  short_name: string | null;
  city: string | null;
  state: string | null;
  country: string;
  domain: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollegeDto {
  id: string;
  name: string;
  shortName: string | null;
  city: string | null;
  state: string | null;
  country: string;
  domain: string | null;
  logoUrl: string | null;
}

export interface CreateCollegeDto {
  name: string;
  shortName?: string;
  city?: string;
  state?: string;
  country?: string;
  domain?: string;
}
