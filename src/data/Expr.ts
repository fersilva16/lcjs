import { prettyPrint } from '../prettyPrint';
import type { Data } from './Data';
import util from 'util';

export type EVar = {
  kind: 'expr';
  type: 'Var';
  name: string;
};

export type EAbs = {
  kind: 'expr';
  type: 'Abs';
  param: string;
  body: Expr;
};

export type EApp = {
  kind: 'expr';
  type: 'App';
  func: Expr;
  arg: Expr;
};

export type Expr = EVar | EAbs | EApp;

const exprFactory = <T extends Expr>(expr: T): T => ({
  ...expr,
  [util.inspect.custom]() {
    return prettyPrint(expr);
  },
});

export const eVar = (name: string) =>
  exprFactory<EVar>({
    kind: 'expr',
    type: 'Var',
    name,
  });
export const eAbs = (param: string, body: Expr) =>
  exprFactory<EAbs>({
    kind: 'expr',
    type: 'Abs',
    param,
    body,
  });
export const eApp = (func: Expr, arg: Expr) =>
  exprFactory<EApp>({
    kind: 'expr',
    type: 'App',
    func,
    arg,
  });

export const isExpr = (data: Data): data is Expr => data.kind === 'expr';
export const isEVar = (expr: Data): expr is EVar =>
  isExpr(expr) && expr.type === 'Var';
export const isEAbs = (expr: Data): expr is EAbs =>
  isExpr(expr) && expr.type === 'Abs';
export const isEApp = (expr: Data): expr is EApp =>
  isExpr(expr) && expr.type === 'App';
