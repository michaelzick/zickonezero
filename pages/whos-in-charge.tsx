import ProjectShowcase from '../src/components/ProjectShowcase';

const WhosInChargePage = () => (
  <ProjectShowcase
    title='Who’s In Charge?'
    summary='An Internal Family Systems journaling app with tarot-style imagery.'
    heroImage={{ src: '/img/squares/king-512.webp', alt: 'Who’s In Charge? crown logo' }}
    roleBullets={[
      'UX architecture',
      'Visual design',
      'Images and text',
    ]}
    projectLink={{ href: 'https://whosincharge.zickonezero.com/', label: 'whosincharge.zickonezero.com' }}
    sections={[
      {
        title: 'Guided prompts without overwhelm',
        body: (
          <>
            Built a structured prompt flow with adaptive hints, keeping users focused on one reflection at a time.
            The tone balances warmth and clarity so journaling feels supported, not clinical.
          </>
        ),
        image: { src: '/img/demostoke/blog-edit-post.webp', alt: 'Writing interface with guided prompts' }
      },
      {
        title: 'Parts library + mood snapshots',
        body: (
          <>
            Created a parts library to quickly tag protectors, exiles, and managers, paired with mood sliders and quick notes.
            Users can revisit entries and see patterns in what triggers each part.
          </>
        ),
        image: { src: '/img/demostoke/feat-events.webp', alt: 'Dashboard showing tagged entries and trends' }
      },
      {
        title: 'Privacy-first journaling',
        body: (
          <>
            Local-first storage with optional cloud backup keeps sensitive work private. Added export flows for therapists
            without exposing data server-side.
          </>
        ),
        image: { src: '/img/demostoke/admin-img-download.webp', alt: 'Privacy and export controls interface' }
      }
    ]}
  />
);

export default WhosInChargePage;
