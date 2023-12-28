import type { Data } from './Data';
import util from 'util';

export type TkVar = {
  kind: 'token';
  type: 'Var';
  name: string;
};

export type TkLambda = {
  kind: 'token';
  type: 'Lambda';
};

export type TkLeftPar = {
  kind: 'token';
  type: 'LeftPar';
};

export type TkRightPar = {
  kind: 'token';
  type: 'RightPar';
};

export type TkDot = {
  kind: 'token';
  type: 'Dot';
};

export type TkSpace = {
  kind: 'token';
  type: 'Space';
};

export type Token = TkVar | TkLambda | TkLeftPar | TkRightPar | TkDot | TkSpace;

const tokenFactory = <T extends Token>(token: T): T => ({
  ...token,
  [util.inspect.custom](): string {
    if (isTkVar(token)) return `TkVar(${token.name})`;

    return `Tk${token.type}`;
  },
});

export const tkVar = (name: string) =>
  tokenFactory<TkVar>({ kind: 'token', type: 'Var', name });
export const tkLambda = () =>
  tokenFactory<TkLambda>({ kind: 'token', type: 'Lambda' });
export const tkLeftPar = () =>
  tokenFactory<TkLeftPar>({ kind: 'token', type: 'LeftPar' });
export const tkRightPar = () =>
  tokenFactory<TkRightPar>({
    kind: 'token',
    type: 'RightPar',
  });
export const tkDot = () => tokenFactory<TkDot>({ kind: 'token', type: 'Dot' });
export const tkSpace = () =>
  tokenFactory<TkSpace>({ kind: 'token', type: 'Space' });

export const isToken = (data: Data): data is Token => data.kind === 'token';
export const isTkVar = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'Var';
export const isTkLambda = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'Lambda';
export const isTkLeftPar = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'LeftPar';
export const isTkRightPar = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'RightPar';
export const isTkDot = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'Dot';
export const isTkSpace = (token: Data): token is TkVar =>
  isToken(token) && token.type === 'Space';
