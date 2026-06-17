/**
 * @file college.service.ts
 * @description College module business logic.
 */

import { AppError } from '../../middlewares/error.middleware';
import { collegeRepository } from './college.repository';
import { parsePagination, buildMeta } from '../../utils/pagination';
import type { CollegeDto, CollegeRow } from './college.types';
import type { SearchCollegesInput } from './college.validation';

const toDto = (row: CollegeRow): CollegeDto => ({
  id: row.id,
  name: row.name,
  shortName: row.short_name,
  city: row.city,
  state: row.state,
  country: row.country,
  domain: row.domain,
  logoUrl: row.logo_url,
});

export const collegeService = {
  async search(input: SearchCollegesInput) {
    const { page, limit, offset } = parsePagination(input.page, input.limit);
    const { rows, total } = await collegeRepository.search(input.q, input.country, limit, offset);

    return {
      colleges: rows.map(toDto),
      meta: buildMeta(page, limit, total),
    };
  },

  async getById(id: string): Promise<CollegeDto> {
    const row = await collegeRepository.findById(id);
    if (!row) throw AppError.notFound('College not found');
    return toDto(row);
  },
};
