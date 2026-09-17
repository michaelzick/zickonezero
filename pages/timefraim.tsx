import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/timefraim/';
const TITLE = 'TimeFraim';
const SUMMARY = 'A daily planner that brings tasks, calendar blocks, and timers into one view.';
const HERO_IMAGE = { src: '/img/projects/timefraim/timefraim-planner.webp', alt: 'TimeFraim day planner with a task queue beside a timeline of scheduled tasks and calendar events, plus completed tasks and recent activity' };

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
      roleBullets={['Product strategy', 'product engineering', 'frontend development']}
      projectLink={{ href: 'https://timefraim.zickonezero.workers.dev/' }}
      sections={[
        {
          title: 'Start from the calendar',
          body: (
            <>
              A day rarely starts empty. I put Google Calendar events on the timeline first, so
              meetings already hold their place and the open hours are easy to spot. Planning starts
              with the time that’s actually free.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-calendar.webp', alt: 'TimeFraim planner in light mode with a day of Google Calendar events on the timeline and no tasks planned yet' },
        },
        {
          title: 'Keep task details close',
          body: (
            <>
              I kept notes, time estimates, and priority in a detail panel beside the plan. Selecting
              a task brings its details into view without leaving the page, and quick duration presets
              make it easier to turn a vague to-do into a realistic block of time.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-task-detail.webp', alt: 'Selected TimeFraim task with notes, duration choices, priority, and timer controls beside the timeline' },
        },
        {
          title: 'See work move forward',
          body: (
            <>
              Some days start with sorting work before scheduling it. I added a board for moving
              tasks from Inbox to Planned, Scheduled, and Done, with estimates and priority on each
              card. A link back to the planner keeps the big picture tied to the day’s actual hours.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-board.webp', alt: 'TimeFraim kanban board in light mode with sample tasks in Inbox, Planned, Scheduled, and Done columns' },
        },
        {
          title: 'Stay with the task',
          body: (
            <>
              Switching to a separate timer pulls attention away from the work. I brought Toggl
              controls into the planner and gave the running task its own elapsed-time panel. Users
              can see what they’re working on, open its details, and stop the timer in one place.
            </>
          ),
          image: { src: '/img/projects/timefraim/timefraim-timer.webp', alt: 'TimeFraim planner with an active focus timer for a scheduled design task' },
        },
      ]}
    />
  </>
);

export default TimeFraimPage;
