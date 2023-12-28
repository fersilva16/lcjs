import { Expr, isEAbs, isEApp, isEVar } from './data/Expr';

export const prettyPrint = (expr: Expr): string => {
  if (isEVar(expr)) {
    return expr.name;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    if (isEApp(body)) {
      const { func, arg } = body;

      if (isEVar(func) && isEVar(arg)) {
        return `λ${param}.${prettyPrint(body)}`;
      }

      return `λ${param}.(${prettyPrint(body)})`;
    }

    return `λ${param}.${prettyPrint(body)}`;
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    if (isEApp(func) && isEApp(arg)) {
      return `(${prettyPrint(func)}) (${prettyPrint(arg)})`;
    }

    if (isEVar(func) && isEApp(arg)) {
      return `${prettyPrint(func)} (${prettyPrint(arg)})`;
    }

    if (isEAbs(func) || isEApp(func)) {
      return `(${prettyPrint(func)}) ${prettyPrint(arg)}`;
    }

    return `${prettyPrint(func)} ${prettyPrint(arg)}`;
  }

  throw new Error('Invalid expr');
};
