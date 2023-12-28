import { inspect } from 'util';
import { Expr, eAbs, eApp, eVar, isEAbs, isEApp, isEVar } from './data/Expr';

const substitute = (
  name: string,
  expr: Expr,
  context: Record<string, Expr>,
  step = 0
): Expr => {
  if (isEVar(expr)) {
    if (expr.name === name) {
      return context[name];
    }

    return expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    return eAbs(
      param,
      substitute(name, body, { ...context, [param]: eVar(param) }, step + 1)
    );
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    return eApp(
      substitute(name, func, context, step + 1),
      substitute(name, arg, context, step + 1)
    );
  }

  throw new Error('Invalid expr');
};

export const interp = (
  expr: Expr,
  context: Record<string, Expr> = {},
  step = 0
): Expr => {
  if (isEVar(expr)) {
    return expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    return eAbs(param, interp(body, context, step + 1));
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    if (isEAbs(func)) {
      const { param, body } = func;
      const contextNew = { ...context, [param]: arg };

      return interp(substitute(param, body, contextNew, step + 1), context);
    }

    return interp(
      eApp(interp(func, context, step + 1), interp(arg, context, step + 1)),
      context,
      step + 1
    );
  }

  throw new Error('Invalid expr');
};
