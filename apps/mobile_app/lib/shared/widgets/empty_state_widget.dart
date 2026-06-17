import 'package:flutter/material.dart';

/// Reusable empty-state widget shown when a list or feed has no content.
///
/// Displays an icon, a title, an optional subtitle, and an optional
/// action button — all customisable by the caller.
class EmptyStateWidget extends StatelessWidget {
  final IconData   icon;
  final String     title;
  final String?    subtitle;
  final String?    actionLabel;
  final VoidCallback? onAction;

  const EmptyStateWidget({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ── Icon ────────────────────────────────────────────────
            Container(
              width:  72,
              height: 72,
              decoration: BoxDecoration(
                color:        Theme.of(context)
                    .colorScheme
                    .primary
                    .withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                icon,
                size:  36,
                color: Theme.of(context).colorScheme.primary.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 20),

            // ── Title ────────────────────────────────────────────────
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
            ),

            // ── Subtitle ─────────────────────────────────────────────
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[500],
                    ),
                textAlign: TextAlign.center,
              ),
            ],

            // ── Action button ─────────────────────────────────────────
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 28),
              ElevatedButton(
                onPressed: onAction,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(160, 44),
                ),
                child: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
