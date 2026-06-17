/**
 * @file college.repository.ts
 * @description Database operations for colleges table.
 */

import { query } from '../../db/index';
import { CollegeRow, CreateCollegeDto } from './college.types';

export const collegeRepository = {
  /**
   * Search colleges by name (case-insensitive, FTS-friendly).
   * PRD: "Searchable list of colleges/organizations"
   */
  async search(
    searchTerm?: string,
    country?: string,
    limit = 20,
    offset = 0,
  ): Promise<{ rows: CollegeRow[]; total: number }> {
    const conditions: string[] = ['is_active = TRUE'];
    const values: unknown[] = [];
    let idx = 1;

    if (searchTerm) {
      conditions.push(
        `(name ILIKE $${idx} OR short_name ILIKE $${idx} OR city ILIKE $${idx})`,
      );
      values.push(`%${searchTerm}%`);
      idx++;
    }

    if (country) {
      conditions.push(`country ILIKE $${idx}`);
      values.push(country);
      idx++;
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const countResult = await query(
      `SELECT COUNT(*) FROM colleges ${where}`,
      values,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const { rows } = await query(
      `SELECT * FROM colleges ${where} ORDER BY name ASC LIMIT $${idx} OFFSET $${idx + 1}`,
      values,
    );

    return { rows, total };
  },

  async findById(id: string): Promise<CollegeRow | null> {
    const { rows } = await query(
      'SELECT * FROM colleges WHERE id = $1 AND is_active = TRUE LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },

  async create(dto: CreateCollegeDto): Promise<CollegeRow> {
    const { rows } = await query(
      `INSERT INTO colleges (name, short_name, city, state, country, domain)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        dto.name,
        dto.shortName ?? null,
        dto.city ?? null,
        dto.state ?? null,
        dto.country ?? 'India',
        dto.domain ?? null,
      ],
    );
    return rows[0];
  },
};
