/**
 * The night half of the end-of-route scene (CityGapScene): a giant street
 * hologram of a woman in a long belted coat, with a bob, looking down and
 * reaching toward the street. Original art, drawn as a few static SVG paths;
 * only its wrappers move (styles/cityGap.ts), so the glow and the slicing are
 * rasterized once.
 */

const ART_ID = 'gap-holo-art';

// The figure in a 700x1500 box: neck, face, coat, collar, the reaching arm
// and hand (with its thumb), the resting arm and hand, and legs. Separate
// paths, so overlapping parts never cancel out under the fill rule.
const BODY_PARTS = [
  'M398 200L404 238L452 234L454 196Z',
  'M392 72C378 84 372 100 372 112C368 124 362 136 358 146C362 152 368 155 368 158C365 163 364 167 367 170C365 174 366 178 371 181C371 190 376 198 385 204C408 212 436 204 452 182L460 110C440 74 412 66 392 72Z',
  'M400 248C372 254 338 262 318 278C308 300 310 340 318 380C330 450 352 520 362 560C350 600 338 640 334 690C318 850 300 1050 282 1235C380 1258 500 1258 580 1232C562 1050 530 850 505 690C500 640 480 600 468 560C486 500 500 420 500 330C500 305 494 290 486 280C470 262 450 252 438 246C425 244 412 245 400 248Z',
  'M396 254C392 238 394 224 400 216L452 212C460 224 462 238 444 250C428 258 410 258 396 254Z',
  'M318 280C300 300 290 340 282 390C276 430 266 470 252 500C236 535 214 575 192 612L186 622L214 640C236 606 258 568 276 532C290 504 302 470 310 430C316 400 322 360 330 330Z',
  'M186 622C172 636 156 650 142 664C132 674 120 688 110 702C106 708 110 714 116 710C126 700 136 690 146 682C140 696 132 712 128 722C126 730 134 732 138 726C146 712 154 700 162 690C160 704 158 716 160 724C162 730 170 728 170 722C172 708 176 694 182 684C188 676 200 662 214 640Z',
  'M200 632C192 650 182 660 168 668C162 672 164 678 170 677C186 672 198 660 208 646Z',
  'M486 282C504 300 514 340 518 390C522 440 526 480 528 520C530 580 526 640 516 700L490 700C494 640 494 590 492 540C490 500 486 450 482 400Z',
  'M490 700C486 722 486 746 494 764C500 774 512 772 516 762C520 742 520 720 516 700Z',
  'M390 1240L386 1400C384 1430 376 1456 360 1474L404 1476C410 1456 414 1430 416 1240Z',
  'M452 1240L462 1400C466 1428 474 1452 494 1468L506 1460C496 1440 490 1420 486 1240Z',
];

const HAIR = 'M368 108C356 62 392 24 440 24C494 24 524 66 520 122C518 160 508 186 496 200C480 212 460 220 434 228C430 214 432 196 438 178C444 156 444 136 434 120C418 108 396 104 368 108Z';

// Light lines over the fill: the coat's front, lapels, belt, cuffs and
// elbows, the hair, and the face (lowered eyes, lips).
const CONTOURS = [
  'M410 256C404 350 400 460 404 560M404 590C400 800 395 1000 392 1240',
  'M400 252C392 290 392 330 404 380M442 250C432 290 420 330 404 380',
  'M362 560C400 572 440 572 468 560M360 582C400 594 440 594 470 582',
  'M376 112C386 108 398 108 408 111M380 124C388 128 398 129 406 126L410 130M366 172C370 174 375 174 379 172',
  'M424 40C474 42 506 84 504 150M456 32C494 54 512 104 498 186M470 70C486 100 486 150 470 200M384 104L386 90M404 102L405 88M424 106L425 92',
  'M186 622L214 640M490 700L516 700M268 476C276 482 286 484 296 482M500 520C510 526 520 526 528 522',
].join('');

const id = (name: string) => `${ART_ID}-${name}`;
const ref = (name: string) => `url(#${id(name)})`;

const Body = () => (
  <>
    {BODY_PARTS.map((d) => <path key={d} d={d} />)}
  </>
);

const StreetHologram = () => (
  <div className='holo'>
    <span className='holo-beam' />
    <div className='holo-sway'>
      <svg className='holo-art' data-art viewBox='0 0 700 1500' focusable='false'>
        <defs>
          {/* One gradient down the whole figure, so the parts read as one body. */}
          <linearGradient id={id('body')} gradientUnits='userSpaceOnUse' x1='0' y1='60' x2='0' y2='1480'>
            <stop offset='0' stopColor='#9d7bff' />
            <stop offset='0.22' stopColor='#c46bff' />
            <stop offset='0.5' stopColor='#8f86ff' />
            <stop offset='0.78' stopColor='#4fe3ff' />
            <stop offset='1' stopColor='#2ff3ff' />
          </linearGradient>
          <linearGradient id={id('hair')} x1='0' y1='0' x2='0.4' y2='1'>
            <stop offset='0' stopColor='#ff3fcf' />
            <stop offset='1' stopColor='#ff8ae6' />
          </linearGradient>
          <pattern id={id('slices')} width='10' height='6' patternUnits='userSpaceOnUse'>
            <rect width='10' height='1.6' fill='#ffffff' opacity='0.4' />
          </pattern>
          <linearGradient id={id('fade')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fff' />
            <stop offset='0.78' stopColor='#fff' />
            <stop offset='0.98' stopColor='#000' />
          </linearGradient>
          <mask id={id('mask')} maskUnits='userSpaceOnUse' x='0' y='0' width='700' height='1500'>
            <rect width='700' height='1500' fill={ref('fade')} />
          </mask>
          <filter id={id('glow')} x='-30%' y='-10%' width='160%' height='120%'>
            <feGaussianBlur stdDeviation='14' />
          </filter>
          <clipPath id={id('clip')}>
            <Body />
            <path d={HAIR} />
          </clipPath>
        </defs>
        {/* The art the glitch slice re-uses; the lower body fades into the street. */}
        <g id={ART_ID} mask={ref('mask')}>
          <g filter={ref('glow')} opacity='0.6'>
            <g fill='#b46cff'><Body /></g>
            <path d={HAIR} fill='#ff3fcf' />
          </g>
          <g fill={ref('body')} opacity='0.46'><Body /></g>
          <path d={HAIR} fill={ref('hair')} opacity='0.7' />
          <rect width='700' height='1500' fill={ref('slices')} clipPath={ref('clip')} />
          <path
            className='holo-contours'
            d={CONTOURS}
            fill='none'
            stroke='#ffe0f8'
            strokeWidth='2.4'
            strokeLinecap='round'
            opacity='0.85'
          />
        </g>
      </svg>
      {/* A thin slice of the same art that jumps sideways now and then. */}
      <svg className='holo-glitch' data-art viewBox='0 0 700 1500' focusable='false'>
        <use href={`#${ART_ID}`} />
      </svg>
      <span className='holo-sweep-track'><span className='holo-sweep' /></span>
    </div>
    <span className='holo-emitter' />
    <p className='holo-caption'>I dream of the feature</p>
    <p className='holo-kana' lang='ja'>夢を見る</p>
  </div>
);

export default StreetHologram;
