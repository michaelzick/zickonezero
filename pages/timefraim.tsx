import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/timefraim/';
const TITLE = 'TimeFraim';
const SUMMARY = 'A daily planner that brings tasks, calendar blocks, and timers into one view.';
const HERO_IMAGE = { src: '/img/projects/timefraim/timefraim-planner.webp', alt: 'TimeFraim day planner with a task queue, scheduled work, and completed tasks' };

const TimeFraimPage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      ogImageAlt={HERO_IMAGE.alt}
      ogImageWidth={3456}
      ogImageHeight={1934}
      jsonLd={[
        creativeWorkJsonLd({ name: TITLE, description: SUMMARY, path: PATH, image: HERO_IMAGE.src }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: TITLE, path: PATH },
        ]),
      ]}
    />
    <ProjectShowcase
      title={TITLE}
      summary={SUMMARY}
      heroImage={HERO_IMAGE}
      roleBullets={['Product strategy', 'UX design', 'Frontend development']}
      projectLink={{ href: 'https://timefraim.zickonezero.workers.dev/' }}
      sections={[
        {
          title: 'Plan a day that fits',
          body: (
            <>
              A task list says what needs doing, but it doesn’t show where the time will come from.
              I put the queue beside a visual timeline so users can drag tasks into the day, see
              Google Calendar commitments, and leave breathing room between blocks.
            </>
          ),
          image: HERO_IMAGE,
        },
        {
          title: 'Keep task details close',
          body: (
            <>
              I kept notes, time estimates, and priority in a detail panel beside the plan. Selecting
              a task brings its context into view without opening another page, and quick duration
              choices make it easier to turn a vague to-do into a realistic block of time.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-task-detail.webp', alt: 'Selected TimeFraim task with notes, duration choices, priority, and timer controls beside the timeline' },
        },
        {
          title: 'See work move forward',
          body: (
            <>
              Some days start with sorting work before scheduling it. I added a board that moves
              tasks from Inbox to Planned, Scheduled, and Done, with estimates and priority on each
              card. A link back to the planner connects the bigger picture to the day’s actual time.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-board.webp', alt: 'TimeFraim kanban board with sample tasks in Inbox, Planned, Scheduled, and Done columns' },
        },
        {
          title: 'Stay with the task',
          body: (
            <>
              Switching to a separate timer can pull attention away from the work. I brought Toggl
              controls into the planner and gave the running task a prominent elapsed-time panel.
              Users can see what they’re working on, open its details, and stop the timer in one place.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-timer.webp', alt: 'TimeFraim planner with an active focus timer for a scheduled design task' },
        },
      ]}
    />
  </>
);

export default TimeFraimPage;
