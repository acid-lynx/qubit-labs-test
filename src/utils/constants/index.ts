export const TOTAL_HORSES = 20;
export const HORSES_PER_ROUND = 10;
export const RACE_DISTANCES: number[] = [1200, 1400, 1600, 1800, 2000, 2200];
export const BASE_DISTANCE = 1200;
export const MIN_CONDITION = 1;
export const MAX_CONDITION = 100;

export const FIRST_NAMES: string[] = [
  'Storm',
  'Gallant',
  'Noble',
  'Velvet',
  'Iron',
  'Solar',
  'Lunar',
  'Mystic',
  'Brave',
  'Swift',
  'Crimson',
  'Emerald',
  'Wild',
  'Ghost',
  'Desert',
  'Ocean',
  'Shadow',
  'Frost',
  'Copper',
  'Peak',
];
export const LAST_NAMES: string[] = [
  'Runner',
  'Dancer',
  'Bolt',
  'Flash',
  'Glory',
  'Dream',
  'Racer',
  'King',
  'Queen',
  'Prince',
  'Princess',
  'Heart',
  'Soul',
  'Fire',
  'Knight',
  'Legend',
  'Hero',
  'Scout',
  'Song',
  'Whisper',
];

export const generateColor = (): string =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

export const generateCondition = (): number =>
  Math.floor(Math.random() * MAX_CONDITION) + MIN_CONDITION;

export const generateHorseName = (): string => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};
