import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/event_model.dart';

class EventsTabPage extends StatefulWidget {
  final String circleId;
  final bool isCircleAdmin;

  const EventsTabPage({
    super.key,
    required this.circleId,
    this.isCircleAdmin = true,
  });

  @override
  State<EventsTabPage> createState() => _EventsTabPageState();
}

class _EventsTabPageState extends State<EventsTabPage> {
  final List<EventModel> _events = [
    EventModel(
      id: 'evt-1',
      title: 'Annual Campus Hackathon & Demo Day 2026',
      description: 'Collaborative coding, mentor sessions, and cash prizes for top projects!',
      locationName: 'Virtual Arena & Main Auditorium',
      startsAt: DateTime.now().add(const Duration(days: 2)).toIso8601String(),
      endsAt: DateTime.now().add(const Duration(days: 2, hours: 6)).toIso8601String(),
      joinLink: 'https://meet.google.com/abc-defg-hij',
      isOnline: true,
      attendeesCount: 142,
      isAttending: false,
    ),
    EventModel(
      id: 'evt-2',
      title: 'Competitive Programming Masterclass',
      description: 'Dynamic programming tips and live problem solving with Google engineers.',
      locationName: 'Zoom Live Stream',
      startsAt: DateTime.now().add(const Duration(days: 5)).toIso8601String(),
      endsAt: DateTime.now().add(const Duration(days: 5, hours: 2)).toIso8601String(),
      joinLink: 'https://zoom.us/j/123456789',
      isOnline: true,
      attendeesCount: 88,
      isAttending: true,
    ),
  ];

  void _launchJoinLink(String? url, String eventTitle) {
    if (url == null || url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No join link provided for this event.')),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1B1B2A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.link_rounded, color: AppColors.accentLight),
            SizedBox(width: 8),
            Text('Event Join Link', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(eventTitle, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white12),
              ),
              child: SelectableText(
                url,
                style: const TextStyle(color: AppColors.accentLight, fontSize: 13),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Click Join Now to connect to this live event session.',
              style: TextStyle(color: Colors.white54, fontSize: 12),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening event session: $url 🚀'),
                  backgroundColor: AppColors.accent,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.accent),
            icon: const Icon(Icons.open_in_new_rounded, size: 16, color: Colors.white),
            label: const Text('Join Now', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _openCreateEventDialog() {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final linkController = TextEditingController();
    final locController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: EdgeInsets.only(
          top: 24,
          left: 20,
          right: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
        ),
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Schedule Circle Event',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: titleController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Event Title',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: descController,
                maxLines: 2,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Description',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: linkController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Redirect Join Link (e.g. Zoom, Google Meet)',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  prefixIcon: const Icon(Icons.link, color: AppColors.accent),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: locController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Location / Platform Name',
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  prefixIcon: const Icon(Icons.location_on, color: AppColors.accent),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (titleController.text.trim().isEmpty) return;
                    final newEvt = EventModel(
                      id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
                      title: titleController.text.trim(),
                      description: descController.text.trim(),
                      joinLink: linkController.text.trim().isNotEmpty ? linkController.text.trim() : null,
                      locationName: locController.text.trim().isNotEmpty ? locController.text.trim() : 'Online Event',
                      startsAt: DateTime.now().add(const Duration(days: 1)).toIso8601String(),
                      endsAt: DateTime.now().add(const Duration(days: 1, hours: 2)).toIso8601String(),
                      attendeesCount: 1,
                      isAttending: true,
                    );
                    setState(() {
                      _events.insert(0, newEvt);
                    });
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Event published with join link!')),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Publish Event', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: widget.isCircleAdmin
          ? FloatingActionButton.extended(
              onPressed: _openCreateEventDialog,
              backgroundColor: AppColors.accent,
              icon: const Icon(Icons.add_rounded, color: Colors.white),
              label: const Text('New Event', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            )
          : null,
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _events.length,
        itemBuilder: (context, index) {
          final evt = _events[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            color: AppColors.card,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
              side: const BorderSide(color: AppColors.border),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.event_available_rounded, color: AppColors.accent, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              evt.title,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              evt.locationName ?? 'Online Meeting',
                              style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (evt.description != null && evt.description!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      evt.description!,
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.3),
                    ),
                  ],
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.people_outline_rounded, size: 16, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        '${evt.attendeesCount} Going',
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                      ),
                      const Spacer(),
                      // Redirect JOIN EVENT button
                      ElevatedButton.icon(
                        onPressed: () => _launchJoinLink(evt.joinLink, evt.title),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.accent,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.open_in_new_rounded, size: 16, color: Colors.white),
                        label: const Text(
                          'JOIN EVENT',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
