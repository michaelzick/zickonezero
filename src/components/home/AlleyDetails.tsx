/** Original, fixed geometry: the server and client paint the same worn street. */
export const AlleyPaving = () => (
  <svg className='street-surface' data-art viewBox='0 0 900 3200' preserveAspectRatio='none' focusable='false'>
    <path className='paving-patches' d='M110 1930h180l24 270-180 40ZM570 2480l174-20 36 350-185 24ZM320 2700l160 10 30 265-196-15ZM35 2820l128-20 12 225H35Z' />
    <path className='paving-cracks' d='M180 3200l24-220-40-90 58-120-14-165M680 3200l-40-175 34-98-22-210 36-70M320 2790l105-25 42 45 98-35M210 2490l90-32 64 24 42-44M510 2340l-14-100 38-62-12-140M100 2160l85-34 36 28' />
    <path className='gutter' d='M40 1800v1400M860 1700v1500' />
    <path className='drain' d='M42 2890h100v105H42ZM748 2450h110v96H748ZM330 2350h180v150H330Z' />
    <path className='drain-slats' d='M52 2908h80m-80 18h80m-80 18h80m-80 18h80m-80 18h80M760 2466h86m-86 20h86m-86 20h86m-86 20h86M352 2372v104m26-104v104m26-104v104m26-104v104m26-104v104m26-104v104' />
    <path className='puddle' d='M210 3060q80-85 174-30t160-5q45 50-18 72t-146-8q-124 40-170-29ZM610 2670q90-40 156 15l-8 50q-100 20-148-65Z' />
  </svg>
);

/** Extra street-level details stay local to the hero's shared facade renderer. */
export const AlleyWallWear = () => (
  <svg className='wall-wear' data-art viewBox='0 0 3200 1400' preserveAspectRatio='none' focusable='false'>
    <path className='wall-stains' d='M90 1400V880l18 90 25-110 16 155 22-24v409ZM430 1400v-350l44 40 30-60 18 135 28-60v295ZM850 1400v-440l24 45 22-90 30 150 20-40v375Z' />
    <path className='utility-pipes' d='M70 170v1020h90v210M390 400v730h-45v270M810 610v540h65v250M20 1000h500v-75h300' />
    <path className='pipe-clamps' d='M55 480h30m-30 280h30m-30 300h30M375 630h30m-30 340h30M795 830h30m-30 210h30' />
    <path className='service-door' d='M200 1140h94v260h-94ZM975 1160h85v240h-85Z' />
    <path className='door-inset' d='M214 1155h66v172h-66ZM989 1175h57v150h-57Z' />
    <path className='door-handle' d='M271 1350h12M1040 1340h10' />
    <path className='shutter-patches' d='M530 1230l95-7v108l-95 9ZM1160 1240h115v100h-115Z' />
    <path className='wall-posters' d='M155 1140l30-4v68l-27-5ZM720 1180h42v82l-8-8-10 10-8-7-16 2Z' />
    <path className='poster-ink' d='M163 1156h14m-14 9h14m-14 9h10M727 1195h28m-28 12h22m-22 12h28' />
    <path className='service-light' d='M200 1128h94M975 1148h85' />
  </svg>
);

export const AlleyRefuse = () => (
  <svg data-art viewBox='0 0 180 130' focusable='false'>
    <path className='bin-body' d='M12 36h104l-8 82H20ZM8 27l111-5 5 17H7Z' />
    <path className='bin-trim' d='M16 43h96M31 56v46m24-46v46m24-46v46m20-46v46M26 118v7m73-7v7' />
    <path className='trash-bag' d='M121 120q-17-21-2-46l11-13-3-9 13 2-2 9q38 13 33 45l-9 12ZM84 124q-15-9-3-25l8-12-2-8 9 1-1 8q25 8 28 27l-10 10Z' />
    <path className='bag-fold' d='m135 75-4 28 13 11m-49-13 9 16' />
    <path className='loose-cardboard' d='m2 116 27-6 16 9-28 7ZM143 123l20-10 14 6-15 10Z' />
  </svg>
);
