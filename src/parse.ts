import { Data } from './data/Data';
import { type Expr, eVar, isEVar, isExpr, eAbs, eApp } from './data/Expr';
import {
  type Token,
  isTkVar,
  isTkLambda,
  isTkDot,
  isTkSpace,
  isTkLeftPar,
  isTkRightPar,
} from './data/Token';

type State = Array<Token | Expr>;

const parseVar = (state: State) => {
  if (state.length !== 1) {
    return undefined;
  }

  const [token] = state;

  if (isTkVar(token)) {
    const { name } = token;

    return eVar(name);
  }

  return undefined;
};

const parseAbs = (state: State, tokens: Token[]) => {
  if (state.length !== 4) {
    return undefined;
  }

  if (
    isTkLambda(state[0]) &&
    isEVar(state[1]) &&
    isTkDot(state[2]) &&
    isExpr(state[3])
  ) {
    if (
      !(
        tokens[0] &&
        isTkSpace(tokens[0]) &&
        tokens[1] &&
        (isTkLambda(tokens[1]) || isTkLeftPar(tokens[1]))
      )
    ) {
      return eAbs(state[1].name, state[3]);
    }
  }
};

const parseApp = (state: State) => {
  if (state.length !== 3) {
    return undefined;
  }

  if (isExpr(state[0]) && isTkSpace(state[1]) && isExpr(state[2])) {
    return eApp(state[0], state[2]);
  }

  return undefined;
};

const parseParen = (state: State) => {
  if (state.length !== 3) {
    return undefined;
  }

  if (isTkLeftPar(state[0]) && isExpr(state[1]) && isTkRightPar(state[2])) {
    return state[1];
  }

  return undefined;
};

export const tryParse = (state: State, tokens: Token[]) => {
  const r =
    parseParen(state) ||
    parseApp(state) ||
    parseAbs(state, tokens) ||
    parseVar(state);

  return r;
};

export const reduce = (
  state: State,
  chars: State,
  tokens: Token[]
): [State, Token[]] => {
  if (!state.length) {
    return [chars, tokens];
  }

  const others = state.slice(0, -1);
  const last = state.at(-1) as Data;

  const parsed = tryParse([last, ...chars], tokens);

  if (parsed) {
    return reduce([...others, parsed], [], tokens);
  }

  return reduce(others, [last, ...chars], tokens);
};

const shift = (state: State, tokens: Token[]): [Expr, Token[]] => {
  const [token, ...rest] = tokens;

  if (!tokens.length && state.length) {
    return [state[0] as Expr, []];
  }

  const [ns, nts] = reduce([...state, token], [], rest);

  return shift(ns, nts);
};

export const parse = (tokens: Token[]) => shift([], tokens);
