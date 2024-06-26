import {
  isDot,
  isLambda,
  isLeftPar,
  isLetter,
  isRightPar,
  isSpace,
} from './data/Char';
import {
  Token,
  tkDot,
  tkLambda,
  tkLeftPar,
  tkRightPar,
  tkVar,
} from './data/Token';

export const tokenize = (code: string): Token[] => {
  if (!code.length) {
    return [];
  }

  const [char, ...rest] = code;

  const getToken = () => {
    if (isLetter(char)) {
      return [tkVar(char)];
    }

    if (isLambda(char)) {
      return [tkLambda()];
    }

    if (isLeftPar(char)) {
      return [tkLeftPar()];
    }

    if (isRightPar(char)) {
      return [tkRightPar()];
    }

    if (isDot(char)) {
      return [tkDot()];
    }

    if (isSpace(char)) {
      return [];
    }

    throw new Error('Invalid char');
  };

  return [...getToken(), ...tokenize(rest.join(''))];
};
