/**
 * @file search.controller.ts
 * @description Controller for global search endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';

export const searchController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = String(req.query.q || '');
      const type = String(req.query.type || 'all');
      const limit = Number(req.query.limit) || 15;

      if (!q.trim()) {
        res.status(200).json({ success: true, data: { users: [], circles: [], events: [], groups: [] } });
        return;
      }

      if (type === 'users') {
        const users = await searchService.searchUsers(q, limit);
        res.status(200).json({ success: true, data: { users } });
        return;
      } else if (type === 'circles') {
        const circles = await searchService.searchCircles(q, limit);
        res.status(200).json({ success: true, data: { circles } });
        return;
      } else if (type === 'events') {
        const events = await searchService.searchEvents(q, limit);
        res.status(200).json({ success: true, data: { events } });
        return;
      } else if (type === 'groups') {
        const groups = await searchService.searchGroups(q, limit);
        res.status(200).json({ success: true, data: { groups } });
        return;
      }

      const results = await searchService.searchAll(q, limit);
      res.status(200).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  },
};
