import TrackedLink from '../TrackedLink';
import { type CaseStudyData, type CaseStudyImage } from '../caseStudy/types';

const DIR = '/img/projects/rackloose';
const STUDIO_URL = 'https://www.rackloose.com/';
const MIKE_OS_URL = 'https://www.michaelzick.com/';

const phone = (file: string, alt: string): CaseStudyImage => ({ src: `${DIR}/${file}`, alt, portrait: true });
const screen = (file: string, alt: string): CaseStudyImage => ({ src: `${DIR}/${file}`, alt });

const HERO = screen(
  'rackloose-hero.webp',
  'Rackloose front panel playing the Bone Orchard preset, with DICTATOR’s looping MIDI clip and MONARCH above the transport and keyboard'
);

const MIKE_OS = screen('rackloose-mike-os.webp', 'Rackloose open in a window on the Mike OS desktop, playing the Trap Soul preset');
// The club stays a hint: no link to it and no URL in the copy or the alt text.
const CLUB = screen('rackloose-club-booth.webp', 'Rackloose in the booth of a basement club, beside a ticket stub that reads You’re the DJ');

const mikeOsLink = (location: string, section: string) => (
  <TrackedLink href={MIKE_OS_URL} label='Mike OS' location={location} section={section} target='_blank'>
    Mike OS on michaelzick.com
  </TrackedLink>
);

export const RACKLOOSE_CASE_STUDY: CaseStudyData = {
  id: 'rackloose',
  analyticsId: 'rackloose',
  name: 'Rackloose',
  intro: {
    summary: 'Rackloose is a modular synth that runs in a browser tab: a rack of original instruments, drum machines, and effects you wire together with virtual cables.',
    roles: ['Product strategy', 'UX design', 'product engineering', 'sound design'],
    image: HERO,
    imageBackground: '#111214',
    links: [{ label: 'Web App', href: STUDIO_URL }]
  },
  what: [
    {
      title: 'Product Summary',
      description: 'Rackloose is a studio rack in the browser. Synths, drum machines, sequencers, a mixer, and effects stack in one column, and every one of them is an original design. Press Play All and a preset is making music before you touch a cable. It runs as its own site and as a React component other sites can drop in.',
      image: screen('rackloose-front.webp', 'Rackloose front panel playing the High Dive preset, with STEP–16, SOLID, SIEVE, and LEVEL above the transport and keyboard')
    },
    {
      title: 'The Challenge',
      description: 'Modular synths are famously hard to get into. You get a blank rack, a pile of cables, and silence until you work out what goes where. The browser adds its own rules: audio can’t start until you click, and the whole thing has to work on a phone screen too.',
      image: screen('rackloose-add-device.webp', 'Rackloose Add device catalog with sequencers, synths, drum machines, and effects above the rack')
    },
    {
      title: 'The Solution',
      description: 'Start with sound. The rack opens on a full patch, and 27 factory presets in seven styles, from Trap and Funk to Reggae, Synthwave, and Industrial, are one click away. Each one is a starting point you can pull apart. When you get curious, flip the rack and every cable is right there.',
      image: screen('rackloose-presets.webp', 'Rackloose Presets panel with factory presets grouped by style above the rack')
    },
    {
      title: 'My Roles',
      description: 'I designed every device and the rack that holds them, built the sound engine and its DSP, composed the factory presets, and wrote the user guide. Then I packaged it all as a component so it could live inside other sites.',
      image: screen('rackloose-guide.webp', 'Rackloose user guide open over the rack')
    }
  ],
  how: {
    heading: 'Studio Experience',
    columns: [
      {
        title: 'Play First, Patch Later',
        copy: 'Nobody has to patch anything to hear something. Play All starts every sequencer at once, the computer keyboard plays whichever instrument you click, and a MIDI keyboard works too. The front panel holds the knobs and the music, and the cables wait on the back until you want them.'
      },
      {
        title: 'Depth on the Back',
        copy: 'Flip the rack and the whole signal path is out in the open. Cables are colored by what they carry: audio, control voltage, or gate. On the back, each device shows only its jacks, with no knobs in the way.'
      }
    ],
    image: screen('rackloose-rear-mix.webp', 'Rackloose rear panel with color-coded audio, CV, and gate cables running between SPACE, STEP–16, PRISM, and BRIT'),
    gallery: [
      screen('rackloose-monarch.webp', 'MONARCH vintage monosynth with three oscillators, a filter, and two envelopes'),
      screen('rackloose-aurora.webp', 'AURORA eight-voice polysynth with dual oscillators and a source mix'),
      screen('rackloose-prism.webp', 'PRISM six-operator FM synth with its algorithm and operator controls'),
      screen('rackloose-skitter.webp', 'SKITTER Trap step sequencer with kick, snare, clap, and hat lanes'),
      screen('rackloose-strike.webp', 'STRIKE digital drum machine with sixteen lanes of steps'),
      screen('rackloose-boom.webp', 'BOOM analog-style drum machine with its step grid playing')
    ]
  },
  personas: [
    {
      title: 'First-Time Players',
      bullets: [
        'Have never patched a synth and want to hear something good right away.',
        'Start from a preset and change one knob at a time to learn what it does.',
        'Need plain labels and a guide that answers questions without a manual.'
      ]
    },
    {
      title: 'Producers and Synth Nerds',
      bullets: [
        'Know the studio gear these devices nod to and expect them to behave like it.',
        'Want real routing: extra sequencers, modulation, an eight-channel mixer, and bus compression.',
        'Record ideas with DICTATOR, export them as MIDI, and bounce the patch to a WAV.'
      ]
    },
    {
      title: 'People on Phones',
      bullets: [
        'Open the rack on a phone and still expect it to play.',
        'Need jacks and controls big enough to drag a cable with a thumb.',
        'Keep the ringer on silent and still want to hear the rack.'
      ]
    },
    {
      title: 'Host Sites',
      bullets: [
        'Mount Rackloose as a React component inside their own pages.',
        'Need it to pause when it’s hidden, keep its keyboard shortcuts to itself, and clean up completely when it closes.',
        'Pin an exact release and check its checksum before installing it.'
      ]
    }
  ],
  methods: [
    {
      title: 'Hardware as the Reference',
      bullets: [
        'Modeled each device on a classic piece of studio gear, from console channel strips to vintage polysynths, then gave it an original name, panel, and sound.',
        'Kept the hardware habits that make racks fun: long-throw faders, LED meters, needles on the compressors, and a flip to the back for the cables.',
        'Put mute, solo, clear, swap, move, duplicate, and remove in the same spot on every device.'
      ],
      images: [screen('rackloose-cohere.webp', 'SUM eight-channel mixer with faders and LED meters above the COHERE bus compressor and the MAIN output')]
    },
    {
      title: 'Patching Without Fear',
      bullets: [
        'Allowed one cable per jack, with numbered spares on every output, so one signal can feed several inputs without stacked plugs.',
        'Lit up only the free jacks that fit while you drag, with a line of text that says what to do next. Escape cancels.',
        'Kept 50 steps of Undo and added Revert to the saved patch, so an experiment never costs you the patch.'
      ],
      images: [screen('rackloose-patching.webp', 'A cable mid-drag on the Rackloose rear panel, with only the free compatible jacks highlighted')]
    },
    {
      title: 'The Sound Engine',
      bullets: [
        'Built the rack on Web Audio. Ten devices also have an Analog engine: ladder filters and modeled drums written in Rust, compiled to WebAssembly, and run in AudioWorklets at 2× oversampling.',
        'Level-matched every Analog engine to its Digital version, with Digital as the fallback wherever WebAssembly can’t run.',
        'Made Export WAV render the patch offline through the same graph, so the file sounds like what you heard. Browser audio tests and Rust DSP tests keep it that way.'
      ],
      images: [screen('rackloose-talon.webp', 'TALON harmonic compressor between FORGE’s step grid and the CONSOLE channel EQ')]
    },
    {
      title: 'Shipping It as a Component',
      bullets: [
        'Packaged the rack as a React component with props for keyboard focus, pausing audio, and its own save slot, and made it dispose of every audio node when it unmounts.',
        'Shipped each version as an immutable release archive with a checksum, so host sites install exactly the build they tested.',
        'Left out the backend, accounts, API keys, and analytics. Patches autosave in the browser and export as files.'
      ],
      images: [MIKE_OS, CLUB]
    }
  ],
  outcome: [
    <>
      Live at{' '}
      <TrackedLink href={STUDIO_URL} label='www.rackloose.com' location='rackloose_case_study_outcome' section='Rackloose UX Case Study' target='_blank'>
        www.rackloose.com
      </TrackedLink>
      {' '}as a standalone studio.
    </>,
    <>Running inside {mikeOsLink('rackloose_case_study_outcome', 'Rackloose UX Case Study')}, where it opens like any other desktop app.</>,
    'Booked for a regular gig in a basement bar somewhere on this site. You’ll have to find it.',
    '25 releases and 137 commits in about three weeks.'
  ],
  screens: {
    logo: { src: '/img/squares/rackloose-icon-square.webp', alt: 'Rackloose app icon' },
    link: { label: 'www.rackloose.com', href: STUDIO_URL },
    hero: HERO,
    blocks: [
      {
        id: 'screens-front-panel',
        title: 'Front Panel',
        navLabel: 'Front',
        copy: 'The front panel is where the music happens: knobs, step buttons, and the transport and keyboard along the bottom. The studio fills the screen or shrinks into a window.',
        images: [
          screen('rackloose-voice.webp', 'SOLID oscillator, SIEVE filter, LEVEL amplifier, and CONTOUR envelope on the front panel'),
          screen('rackloose-window.webp', 'Rackloose in windowed mode playing Digital Boogie')
        ]
      },
      {
        id: 'screens-patching',
        title: 'Patching',
        copy: 'Flip the rack to patch. Cables are colored by signal, each jack takes one cable, and a drag lights up only the jacks that fit.',
        images: [
          screen('rackloose-rear.webp', 'Rackloose rear panel for the Bone Orchard preset, with DICTATOR’s pitch and gate cables running to MONARCH and MONARCH’s audio through RUST and CONSOLE'),
          screen('rackloose-patching.webp', 'A cable mid-drag on the rear panel with compatible jacks highlighted')
        ]
      },
      {
        id: 'screens-instruments',
        title: 'Instruments',
        copy: 'MONARCH is a three-oscillator mono synth, AURORA an eight-voice poly, ORACLE a five-voice poly, and PRISM a six-operator FM synth. The three polys can turn one key into a whole chord, and all four switch between a Digital engine and an Analog one.',
        images: [
          screen('rackloose-monarch.webp', 'MONARCH vintage monosynth'),
          screen('rackloose-aurora.webp', 'AURORA eight-voice polysynth'),
          screen('rackloose-oracle.webp', 'ORACLE five-voice polysynth set to a major ninth chord, with its engine switched to Analog'),
          screen('rackloose-prism.webp', 'PRISM six-operator FM synth')
        ]
      },
      {
        id: 'screens-drums',
        title: 'Drums and Grooves',
        navLabel: 'Drums',
        copy: 'BOOM, STRIKE, and FORGE are three of the five drum machines, from an analog-style kit to an Industrial one. SKITTER makes no sound on its own. It plays steps and rolls on any drum machine it’s patched to.',
        images: [
          screen('rackloose-skitter.webp', 'SKITTER Trap step sequencer'),
          screen('rackloose-boom.webp', 'BOOM analog-style drum machine'),
          screen('rackloose-strike.webp', 'STRIKE digital drum machine'),
          screen('rackloose-forge.webp', 'FORGE Industrial drum kit')
        ]
      },
      {
        id: 'screens-recording',
        title: 'Recording and Mixing',
        navLabel: 'Recording',
        copy: 'DICTATOR records what you play into a looping MIDI clip, with a piano roll for fixing notes and .mid files in and out. SUM mixes eight channels, each named after the instrument feeding it, and VALVE and MAIN finish the mix.',
        images: [
          screen('rackloose-piano-roll.webp', 'DICTATOR piano roll editing a four-bar clip that plays MONARCH'),
          screen('rackloose-valve.webp', 'SUM mixer above the VALVE tube limiter and the MAIN output')
        ]
      },
      {
        id: 'screens-effects',
        title: 'Effects',
        copy: 'RUST breaks a sound up five different ways, BRIT and CONSOLE shape the tone, ECHO and SPACE add delay and reverb, and TALON, COHERE, and VALVE handle the squeeze.',
        images: [
          screen('rackloose-rust.webp', 'RUST distortion above the CONSOLE channel EQ'),
          screen('rackloose-brit.webp', 'BRIT three-band EQ with its filter response display'),
          screen('rackloose-space.webp', 'ECHO feedback delay and SPACE stereo reverb between CONTOUR and STEP–16'),
          screen('rackloose-talon.webp', 'TALON harmonic compressor')
        ]
      },
      {
        id: 'screens-presets',
        title: 'Presets and Devices',
        navLabel: 'Presets',
        copy: 'Twenty-seven factory presets in seven styles, plus your own, saved in the browser or exported as files. Add device opens the full catalog of sequencers, synths, drum machines, and effects.',
        images: [
          screen('rackloose-presets.webp', 'Rackloose Presets panel'),
          screen('rackloose-add-device.webp', 'Rackloose Add device catalog')
        ]
      },
      {
        id: 'screens-phone',
        title: 'On a Phone',
        navLabel: 'Phone',
        copy: 'On a phone the rack keeps every device, every cable, and the full transport, and it still plays with the ringer on silent.',
        images: [
          phone('rackloose-phone-front.webp', 'Rackloose on an iPhone with the front panel and keyboard'),
          phone('rackloose-phone-rear.webp', 'Rackloose rear panel with cables on an iPhone'),
          phone('rackloose-phone-skitter.webp', 'SKITTER playing on an iPhone')
        ]
      },
      {
        id: 'screens-out-in-the-world',
        title: 'Out in the World',
        navLabel: 'Out There',
        copy: (
          <>
            Rackloose opens like any other app inside {mikeOsLink('rackloose_product_screens', 'Rackloose Product Screens')}. It
            also plays a regular gig in a basement bar somewhere on this site. Look for the sign.
          </>
        ),
        images: [MIKE_OS, CLUB]
      }
    ]
  }
};
