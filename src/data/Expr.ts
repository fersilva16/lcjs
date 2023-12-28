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

const exprFactor = <T extends Expr>(expr: T): T => ({
  ...expr,
  [util.inspect.custom]() {
    return prettyPrint(expr);
    // if (isEVar(expr)) {
    //   return `EVar(${expr.name})`;
    // }

    // if (isEAbs(expr)) {
    //   return `EAbs(${expr.param}, ${util.inspect(expr.body)})`;
    // }

    // if (isEApp(expr)) {
    //   return `EApp(${util.inspect(expr.func)}, ${util.inspect(expr.arg)})`;
    // }
  },
});

export const eVar = (name: string) =>
  exprFactor<EVar>({
    kind: 'expr',
    type: 'Var',
    name,
  });
export const eAbs = (param: string, body: Expr) =>
  exprFactor<EAbs>({
    kind: 'expr',
    type: 'Abs',
    param,
    body,
  });
export const eApp = (func: Expr, arg: Expr) =>
  exprFactor<EApp>({
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
