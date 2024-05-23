import { interp } from './interp';
import { parse } from './parse';
import { prettyPrint } from './prettyPrint';
import { tokenize } from './tokenize';

export const lambdaCalculus = (code: string) => {
  return prettyPrint(interp(parse(tokenize(code))[0]));
};
