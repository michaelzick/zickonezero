-- TimeFraim screenshot sandbox seed.
--
-- Runs only inside the isolated local Supabase project "timefraim-shots" that
-- scripts/timefraim-sandbox/start.sh creates. Never run it against the real
-- "timefraim" project: it inserts an auth user and sample planner data.
--
-- Scenario: Tuesday 2026-09-15 in America/Los_Angeles (PDT, UTC-7). All
-- timestamps are UTC, so 09:00 PDT is written as 16:00+00. The capture script
-- fixes the browser clock to 17:52:00Z (10:52 AM PDT), inside the running
-- 10:30-12:00 focus block.

-- 1. The allowed user (ALLOWED_EMAIL in the app's .env) for the magic-link
--    sign-in. GoTrue's schema exists at seed time because the CLI runs the
--    auth migrations before seeding. The password is unused (login is by
--    magic link) but the column must be non-null for GoTrue.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, last_sign_in_at
) values (
  '00000000-0000-0000-0000-000000000000',
  '0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4',
  'authenticated', 'authenticated', 'mzick@zickonezero.com',
  extensions.crypt('screenshot-sandbox-only', extensions.gen_salt('bf')),
  '2026-09-01 15:00:00+00',
  '', '', '', '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Michael Zick"}'::jsonb,
  '2026-09-01 15:00:00+00', '2026-09-15 15:00:00+00', '2026-09-15 15:00:00+00'
) on conflict (id) do nothing;

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values (
  '0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c5',
  '0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4',
  '0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4',
  '{"sub":"0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4","email":"mzick@zickonezero.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email', '2026-09-15 15:00:00+00', '2026-09-01 15:00:00+00', '2026-09-15 15:00:00+00'
) on conflict (provider_id, provider) do nothing;

insert into public.app_access_users (email) values ('mzick@zickonezero.com')
on conflict (email) do nothing;

-- 2. Theme stays "system" so the capture script chooses dark or light per
--    shot through the browser's prefers-color-scheme.
insert into public.user_preferences (user_id, theme, task_start_notifications_enabled, task_end_notifications_enabled)
values ('0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4', 'system', false, false)
on conflict (user_id) do nothing;

-- 3. A placeholder Toggl connection so project names render in the timer
--    panel and task detail. Read paths never decrypt the token, and the
--    capture script never starts or stops timers through the API.
insert into public.user_toggl_connections (
  user_id, api_token_ciphertext, api_token_hint, workspace_id, workspace_name,
  default_project_id, default_project_name, available_workspaces, available_projects, last_validated_at
) values (
  '0b9d1c2e-3f4a-4b5c-8d6e-7f8091a2b3c4',
  'sandbox-not-a-real-token', '••••••••7f2a', '1234567', 'Design Studio',
  '2001', 'Product Design',
  '[{"id":"1234567","name":"Design Studio"}]'::jsonb,
  '[{"id":"2001","name":"Product Design","workspaceId":"1234567","active":true},
    {"id":"2002","name":"Portfolio","workspaceId":"1234567","active":true},
    {"id":"2003","name":"Client Work","workspaceId":"1234567","active":true}]'::jsonb,
  '2026-09-14 15:00:00+00'
) on conflict (user_id) do nothing;

-- 4. Tasks. scheduled_block_id has no foreign key, so blocks can follow.
insert into public.tasks (
  id, title, notes, estimated_minutes, status, priority, category,
  scheduled_block_id, toggl_project_id, completed_on_date, created_at, updated_at
) values
  -- scheduled today (blocks in section 5)
  ('a1000000-0000-4000-8000-000000000001', 'Review checkout prototype feedback',
   'Read the overnight comments in Figma and list the changes worth making before the client review.',
   45, 'scheduled', 'high', 'work', 'b2000000-0000-4000-8000-000000000001', '2003', null,
   '2026-09-14 23:10:00+00', '2026-09-15 15:04:45+00'),
  ('a1000000-0000-4000-8000-000000000002', 'Prototype the day planner timeline',
   'Explore the task-to-timeline flow. Keep calendar commitments visible and leave room between focus blocks.',
   90, 'scheduled', 'high', 'work', 'b2000000-0000-4000-8000-000000000002', '2001', null,
   '2026-09-12 17:00:00+00', '2026-09-15 15:06:20+00'),
  ('a1000000-0000-4000-8000-000000000003', 'Write up usability findings',
   'Summarize the five sessions: what worked, where people hesitated, and the next round of fixes.',
   45, 'scheduled', 'medium', 'work', 'b2000000-0000-4000-8000-000000000003', '2001', null,
   '2026-09-14 22:30:00+00', '2026-09-15 15:07:10+00'),
  ('a1000000-0000-4000-8000-000000000004', 'Prep tomorrow''s design crit',
   'Pick two screens to show and write the questions I want answered.',
   45, 'scheduled', 'medium', 'work', 'b2000000-0000-4000-8000-000000000004', '2001', null,
   '2026-09-14 22:35:00+00', '2026-09-15 15:07:40+00'),
  ('a1000000-0000-4000-8000-000000000005', 'Walk by the ocean',
   'Step away from the screen and recharge.',
   30, 'scheduled', 'low', 'personal', 'b2000000-0000-4000-8000-000000000005', null, null,
   '2026-09-15 14:50:00+00', '2026-09-15 15:08:30+00'),
  -- queue (unscheduled): planned and inbox
  ('a1000000-0000-4000-8000-000000000006', 'Refine the meeting search flow',
   'Make program, day, and location filters easy to scan. Check clear labels, useful results, and a simple path to meeting details.',
   60, 'planned', 'high', 'work', null, '2002', null,
   '2026-09-13 18:00:00+00', '2026-09-15 15:30:00+00'),
  ('a1000000-0000-4000-8000-000000000007', 'Review the mobile navigation',
   'Check thumb reach and visible focus states.',
   30, 'planned', 'medium', 'work', null, '2002', null,
   '2026-09-13 18:05:00+00', '2026-09-15 15:20:00+00'),
  ('a1000000-0000-4000-8000-000000000008', 'Draft onboarding copy variants',
   'Three short versions of the welcome screen for the client to react to.',
   45, 'planned', 'medium', 'work', null, '2003', null,
   '2026-09-14 20:10:00+00', '2026-09-15 15:10:00+00'),
  ('a1000000-0000-4000-8000-000000000009', 'Collect usability questions',
   'Capture questions for the next prototype walkthrough.',
   20, 'inbox', 'medium', 'work', null, null, null,
   '2026-09-15 15:01:12+00', '2026-09-15 15:01:12+00'),
  ('a1000000-0000-4000-8000-000000000010', 'Explore weekend hike ideas',
   'Find a coastal trail and check the weather.',
   15, 'inbox', 'low', 'personal', null, null, null,
   '2026-09-13 02:15:00+00', '2026-09-13 02:15:00+00'),
  ('a1000000-0000-4000-8000-000000000011', 'Book dentist appointment', null,
   15, 'planned', 'low', 'personal', null, null, null,
   '2026-09-14 16:00:00+00', '2026-09-14 16:00:00+00'),
  -- done today (the Done today card matches completed_on_date to the viewed day)
  ('a1000000-0000-4000-8000-000000000012', 'Morning stretch',
   'A few minutes of movement before the workday.',
   15, 'done', 'low', 'personal', null, null, '2026-09-15',
   '2026-09-15 13:55:00+00', '2026-09-15 14:12:00+00'),
  ('a1000000-0000-4000-8000-000000000013', 'Review the week''s commitments',
   'Check calendar events before planning focus time.',
   20, 'done', 'medium', 'work', null, '2001', '2026-09-15',
   '2026-09-14 23:00:00+00', '2026-09-15 15:08:02+00'),
  ('a1000000-0000-4000-8000-000000000014', 'Send the invoice for August', null,
   15, 'done', 'medium', 'work', null, '2003', '2026-09-15',
   '2026-09-14 21:00:00+00', '2026-09-15 15:20:40+00'),
  -- done on earlier days (Board "Done" column only)
  ('a1000000-0000-4000-8000-000000000015', 'Update portfolio project icons', null,
   30, 'done', 'medium', 'work', null, '2002', '2026-09-14',
   '2026-09-13 17:20:00+00', '2026-09-14 23:40:00+00'),
  ('a1000000-0000-4000-8000-000000000016', 'Plan the sprint kickoff notes', null,
   20, 'done', 'low', 'work', null, '2003', '2026-09-11',
   '2026-09-10 16:00:00+00', '2026-09-11 22:05:00+00')
on conflict (id) do nothing;

-- 5. Schedule blocks: one per task (unique index on task_id), no overlaps
--    with each other or with the calendar events below.
insert into public.schedule_blocks (id, task_id, start_at, end_at, source, state, created_at, updated_at) values
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001',
   '2026-09-15 16:30:00+00', '2026-09-15 17:15:00+00', 'manual', 'confirmed',
   '2026-09-15 15:04:45+00', '2026-09-15 15:04:45+00'),            -- 9:30-10:15 AM
  ('b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002',
   '2026-09-15 17:30:00+00', '2026-09-15 19:00:00+00', 'ai', 'confirmed',
   '2026-09-15 15:06:20+00', '2026-09-15 15:06:20+00'),            -- 10:30 AM-12:00 PM (running)
  ('b2000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000003',
   '2026-09-15 20:00:00+00', '2026-09-15 20:45:00+00', 'manual', 'confirmed',
   '2026-09-15 15:07:10+00', '2026-09-15 15:07:10+00'),            -- 1:00-1:45 PM
  ('b2000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000004',
   '2026-09-15 22:00:00+00', '2026-09-15 22:45:00+00', 'manual', 'confirmed',
   '2026-09-15 15:07:40+00', '2026-09-15 15:07:40+00'),            -- 3:00-3:45 PM
  ('b2000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000005',
   '2026-09-15 23:00:00+00', '2026-09-15 23:30:00+00', 'manual', 'confirmed',
   '2026-09-15 15:08:30+00', '2026-09-15 15:08:30+00')             -- 4:00-4:30 PM
on conflict (id) do nothing;

-- 6. External (non-app-managed) Google Calendar events with Google palette colors.
insert into public.calendar_events (
  id, provider, external_event_id, title, start_at, end_at, is_app_managed,
  background_color, foreground_color, source_calendar_id, source_calendar_name,
  raw_payload, external_updated_at, created_at, updated_at
) values
  ('c3000000-0000-4000-8000-000000000001', 'google', 'seed-standup-2026-09-15',
   'Design team standup', '2026-09-15 16:00:00+00', '2026-09-15 16:30:00+00', false,
   '#039be5', '#ffffff', 'studio@zickonezero.com', 'Studio',
   '{"seeded":true}'::jsonb, '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00'),
  ('c3000000-0000-4000-8000-000000000002', 'google', 'seed-lunch-2026-09-15',
   'Lunch', '2026-09-15 19:15:00+00', '2026-09-15 20:00:00+00', false,
   '#33b679', '#ffffff', 'personal', 'Personal',
   '{"seeded":true}'::jsonb, '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00'),
  ('c3000000-0000-4000-8000-000000000003', 'google', 'seed-client-review-2026-09-15',
   'Client review: onboarding flow', '2026-09-15 21:00:00+00', '2026-09-15 21:45:00+00', false,
   '#7986cb', '#ffffff', 'studio@zickonezero.com', 'Studio',
   '{"seeded":true}'::jsonb, '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00', '2026-09-14 20:00:00+00')
on conflict (provider, external_event_id) do nothing;

-- 7. Timer sessions: one finished, one ACTIVE (ended_at null) on the 10:30
--    block, started 10:31:05 PDT so the fixed 10:52:00 clock shows 20:55.
insert into public.timer_sessions (id, task_id, toggl_entry_id, started_at, ended_at, duration_seconds, source) values
  ('d4000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', null,
   '2026-09-15 16:31:05+00', '2026-09-15 17:09:40+00', 2315, 'manual'),
  ('d4000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', null,
   '2026-09-15 17:31:05+00', null, null, 'manual')
on conflict (id) do nothing;

-- 8. Activity log. The Activity card derives its text from action plus
--    payload.taskTitle (planner-audit-log-display.ts), newest first.
insert into public.audit_logs (id, actor_role, action, entity_type, entity_id, diff_summary, payload, created_at) values
  ('e5000000-0000-4000-8000-000000000001', 'user', 'task.create', 'task',
   'a1000000-0000-4000-8000-000000000009', 'Created task "Collect usability questions"',
   '{"taskId":"a1000000-0000-4000-8000-000000000009","taskTitle":"Collect usability questions"}'::jsonb,
   '2026-09-15 15:01:12+00'),
  ('e5000000-0000-4000-8000-000000000002', 'user', 'schedule_block.create', 'schedule_block',
   'b2000000-0000-4000-8000-000000000001', 'Scheduled "Review checkout prototype feedback" for 9:30 AM',
   '{"taskId":"a1000000-0000-4000-8000-000000000001","taskTitle":"Review checkout prototype feedback","scheduleBlockId":"b2000000-0000-4000-8000-000000000001"}'::jsonb,
   '2026-09-15 15:04:45+00'),
  ('e5000000-0000-4000-8000-000000000003', 'assistant', 'schedule_block.create', 'schedule_block',
   'b2000000-0000-4000-8000-000000000002', 'Scheduled "Prototype the day planner timeline" for 10:30 AM',
   '{"taskId":"a1000000-0000-4000-8000-000000000002","taskTitle":"Prototype the day planner timeline","scheduleBlockId":"b2000000-0000-4000-8000-000000000002"}'::jsonb,
   '2026-09-15 15:06:20+00'),
  ('e5000000-0000-4000-8000-000000000004', 'user', 'task.update', 'task',
   'a1000000-0000-4000-8000-000000000013', 'Marked "Review the week''s commitments" done',
   '{"taskId":"a1000000-0000-4000-8000-000000000013","taskTitle":"Review the week''s commitments","status":"done"}'::jsonb,
   '2026-09-15 15:08:02+00'),
  ('e5000000-0000-4000-8000-000000000005', 'user', 'timer.start', 'timer_session',
   'd4000000-0000-4000-8000-000000000001', 'Started timer for "Review checkout prototype feedback"',
   '{"taskId":"a1000000-0000-4000-8000-000000000001","taskTitle":"Review checkout prototype feedback","source":"manual"}'::jsonb,
   '2026-09-15 16:31:05+00'),
  ('e5000000-0000-4000-8000-000000000006', 'user', 'timer.stop', 'timer_session',
   'd4000000-0000-4000-8000-000000000001', 'Stopped the active timer',
   '{"source":"manual"}'::jsonb,
   '2026-09-15 17:09:40+00'),
  ('e5000000-0000-4000-8000-000000000007', 'user', 'timer.start', 'timer_session',
   'd4000000-0000-4000-8000-000000000002', 'Started timer for "Prototype the day planner timeline"',
   '{"taskId":"a1000000-0000-4000-8000-000000000002","taskTitle":"Prototype the day planner timeline","source":"manual"}'::jsonb,
   '2026-09-15 17:31:05+00')
on conflict (id) do nothing;
