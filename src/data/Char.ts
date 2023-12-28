export const letter = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export const lambda = 'λ';

export const leftPar = '(';

export const rightPar = ')';

export const dot = '.';

export const space = ' ';

export const isLetter = (char: string) => letter.includes(char);
export const isLambda = (char: string) => char === lambda;
export const isLeftPar = (char: string) => char === leftPar;
export const isRightPar = (char: string) => char === rightPar;
export const isDot = (char: string) => char === dot;
export const isSpace = (char: string) => char === space;
