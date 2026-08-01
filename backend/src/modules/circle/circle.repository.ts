/**
 * @file circle.repository.ts
 * @description Data access layer for Circles, Community Members, Admin Approvals, and Components.
 */

import { pool, query } from '../../db/index';
import {
  CircleRow,
  CircleMemberRow,
  ComponentTemplateRow,
  CommunityComponentRow,
  CreateCircleDto,
  CircleStatus,
  MemberRole,
  UpdateComponentDto,
} from './circle.types';

export const circleRepository = {
  /**
   * Helper to generate a URL-safe slug from circle name.
   */
  generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  },

  /**
   * Create a new circle/community inside a database transaction.
   * Auto-populates 10 default component toggles from component_templates.
   */
  async createCircle(
    userId: string,
    dto: CreateCircleDto,
    status: CircleStatus = 'pending'
  ): Promise<CircleRow> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const slug = this.generateSlug(dto.name);
      const insertCircleText = `
        INSERT INTO circles (
          name, slug, description, avatar_url, banner_url,
          type, status, college_id, created_by, is_private
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const circleParams = [
        dto.name,
        slug,
        dto.description ?? null,
        dto.avatarUrl ?? null,
        dto.bannerUrl ?? null,
        dto.type ?? 'general',
        status,
        dto.collegeId ?? null,
        userId,
        dto.isPrivate ?? false,
      ];

      const circleRes = await client.query<CircleRow>(insertCircleText, circleParams);
      const newCircle = circleRes.rows[0];

      // Insert creator as 'owner'
      await client.query(
        'INSERT INTO circle_members (circle_id, user_id, role) VALUES ($1, $2, $3)',
        [newCircle.id, userId, 'owner']
      );

      // Initialize default component toggles from templates
      await this.initializeComponentsForCircle(client, newCircle.id);

      await client.query('COMMIT');
      return newCircle;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Auto-create or fetch approved official college/school circle.
   */
  async autoCreateCollegeCircle(collegeId: string, collegeName: string): Promise<CircleRow> {
    // Check if college circle already exists
    const checkText = `
      SELECT c.*, col.name AS college_name
      FROM circles c
      LEFT JOIN colleges col ON c.college_id = col.id
      WHERE c.college_id = $1 AND c.type = 'college'
      LIMIT 1
    `;
    const { rows } = await query(checkText, [collegeId]);
    if (rows.length > 0) {
      return rows[0] as CircleRow;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const slug = `college-${this.generateSlug(collegeName)}`;
      const insertText = `
        INSERT INTO circles (
          name, slug, description, type, status, college_id, is_private
        ) VALUES ($1, $2, $3, 'college', 'approved', $4, FALSE)
        RETURNING *
      `;
      const circleRes = await client.query<CircleRow>(insertText, [
        `${collegeName} Official Circle`,
        slug,
        `Official community circle for ${collegeName}.`,
        collegeId,
      ]);
      const officialCircle = circleRes.rows[0];

      await this.initializeComponentsForCircle(client, officialCircle.id);

      await client.query('COMMIT');
      return officialCircle;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Populate default 10 components for a circle.
   */
  async initializeComponentsForCircle(client: any, circleId: string): Promise<void> {
    const templatesRes = await client.query(
      'SELECT * FROM component_templates ORDER BY display_order ASC'
    );
    const templates: ComponentTemplateRow[] = templatesRes.rows;

    for (const t of templates) {
      await client.query(
        `INSERT INTO community_components (circle_id, component_key, is_enabled, display_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (circle_id, component_key) DO NOTHING`,
        [circleId, t.key, t.is_default, t.display_order]
      );
    }
  },

  /**
   * Approve a pending circle (Admin).
   */
  async approveCircle(id: string): Promise<CircleRow | null> {
    const text = `
      UPDATE circles
      SET status = 'approved', rejection_reason = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, [id]);
    return (rows[0] as CircleRow) ?? null;
  },

  /**
   * Reject a pending circle (Admin).
   */
  async rejectCircle(id: string, reason?: string): Promise<CircleRow | null> {
    const text = `
      UPDATE circles
      SET status = 'rejected', rejection_reason = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, [id, reason ?? null]);
    return (rows[0] as CircleRow) ?? null;
  },

  /**
   * List all pending circles for admin approval.
   */
  async findPendingCircles(): Promise<CircleRow[]> {
    const text = `
      SELECT c.*, col.name AS college_name
      FROM circles c
      LEFT JOIN colleges col ON c.college_id = col.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at ASC
    `;
    const { rows } = await query(text);
    return rows as CircleRow[];
  },

  /**
   * Find circle by ID.
   */
  async findById(id: string): Promise<CircleRow | null> {
    const text = `
      SELECT c.*, col.name AS college_name
      FROM circles c
      LEFT JOIN colleges col ON c.college_id = col.id
      WHERE c.id = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [id]);
    return (rows[0] as CircleRow) ?? null;
  },

  /**
   * Get member role of a user in a circle.
   */
  async getMemberRole(circleId: string, userId: string): Promise<MemberRole | null> {
    const text = `
      SELECT role FROM circle_members
      WHERE circle_id = $1 AND user_id = $2
      LIMIT 1
    `;
    const { rows } = await query(text, [circleId, userId]);
    return rows.length > 0 ? (rows[0].role as MemberRole) : null;
  },

  /**
   * Join a circle.
   */
  async addMember(circleId: string, userId: string, role: MemberRole = 'member'): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertRes = await client.query(
        `INSERT INTO circle_members (circle_id, user_id, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (circle_id, user_id) DO NOTHING
         RETURNING 1`,
        [circleId, userId, role]
      );

      if ((insertRes.rowCount ?? 0) > 0) {
        await client.query(
          'UPDATE circles SET members_count = members_count + 1 WHERE id = $1',
          [circleId]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Leave a circle.
   */
  async removeMember(circleId: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const delRes = await client.query(
        'DELETE FROM circle_members WHERE circle_id = $1 AND user_id = $2 RETURNING 1',
        [circleId, userId]
      );

      if ((delRes.rowCount ?? 0) > 0) {
        await client.query(
          'UPDATE circles SET members_count = GREATEST(members_count - 1, 0) WHERE id = $1',
          [circleId]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Get all 10 component template definitions.
   */
  async getComponentTemplates(): Promise<ComponentTemplateRow[]> {
    const text = 'SELECT * FROM component_templates ORDER BY display_order ASC';
    const { rows } = await query(text);
    return rows as ComponentTemplateRow[];
  },

  /**
   * Get component toggles for a circle, joined with template details.
   */
  async getCircleComponents(circleId: string): Promise<CommunityComponentRow[]> {
    const text = `
      SELECT cc.*,
             ct.name AS template_name,
             ct.description AS template_description,
             ct.icon AS template_icon
      FROM community_components cc
      LEFT JOIN component_templates ct ON cc.component_key = ct.key
      WHERE cc.circle_id = $1
      ORDER BY cc.display_order ASC, ct.display_order ASC
    `;
    const { rows } = await query(text, [circleId]);
    return rows as CommunityComponentRow[];
  },

  /**
   * Update component toggle configuration for a circle.
   */
  async updateComponent(
    circleId: string,
    componentKey: string,
    dto: UpdateComponentDto
  ): Promise<CommunityComponentRow | null> {
    const settingsJson = dto.settings ? JSON.stringify(dto.settings) : null;

    const text = `
      INSERT INTO community_components (circle_id, component_key, is_enabled, custom_name, settings, display_order)
      VALUES ($1, $2, COALESCE($3, TRUE), $4, $5, COALESCE($6, 0))
      ON CONFLICT (circle_id, component_key) DO UPDATE SET
        is_enabled = COALESCE($3, community_components.is_enabled),
        custom_name = COALESCE($4, community_components.custom_name),
        settings = COALESCE($5, community_components.settings),
        display_order = COALESCE($6, community_components.display_order),
        updated_at = NOW()
      RETURNING *
    `;

    const params = [
      circleId,
      componentKey,
      dto.isEnabled ?? null,
      dto.customName ?? null,
      settingsJson,
      dto.displayOrder ?? null,
    ];

    const { rows } = await query(text, params);
    const updated = rows[0] as CommunityComponentRow;

    // Fetch joined details
    const fullText = `
      SELECT cc.*,
             ct.name AS template_name,
             ct.description AS template_description,
             ct.icon AS template_icon
      FROM community_components cc
      LEFT JOIN component_templates ct ON cc.component_key = ct.key
      WHERE cc.id = $1
      LIMIT 1
    `;
    const fullRes = await query(fullText, [updated.id]);
    return (fullRes.rows[0] as CommunityComponentRow) ?? updated;
  },

  /**
   * Get primary circle joined by a user.
   */
  async getUserPrimaryCircle(userId: string): Promise<CircleRow | null> {
    const text = `
      SELECT c.*, col.name AS college_name, cm.role AS user_role
      FROM circle_members cm
      JOIN circles c ON cm.circle_id = c.id
      LEFT JOIN colleges col ON c.college_id = col.id
      WHERE cm.user_id = $1 AND c.status = 'approved'
      ORDER BY (cm.role = 'owner') DESC, c.created_at ASC
      LIMIT 1
    `;
    const { rows } = await query(text, [userId]);
    return (rows[0] as CircleRow) ?? null;
  },

  /**
   * Get all circles joined by a user.
   */
  async getUserCircles(userId: string): Promise<CircleRow[]> {
    const text = `
      SELECT c.*, col.name AS college_name, cm.role AS user_role
      FROM circle_members cm
      JOIN circles c ON cm.circle_id = c.id
      LEFT JOIN colleges col ON c.college_id = col.id
      WHERE cm.user_id = $1 AND c.status = 'approved'
      ORDER BY c.name ASC
    `;
    const { rows } = await query(text, [userId]);
    return rows as CircleRow[];
  },
};
