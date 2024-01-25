import { Expr, eAbs, eApp, eVar, isEAbs, isEApp, isEVar } from './data/Expr';
import { prettyPrint } from './prettyPrint';
import { debug } from './utils/debug';

const equivalence = (
  a: Expr,
  b: Expr,
  ctxA: string[] = [],
  ctxB: string[] = []
): boolean => {
  debug('equivalence', prettyPrint(a), prettyPrint(b), ctxA, ctxB);

  if (isEVar(a) && isEVar(b)) {
    const indexA = ctxA.indexOf(a.name);
    const indexB = ctxB.indexOf(b.name);

    console.log({ indexA, indexB });

    if (indexA >= 0 && indexB >= 0) {
      return indexA === indexB;
    }

    if (indexA >= 0 && indexB === -1) {
      return false;
    }

    if (indexA === -1 && indexB >= 0) {
      return false;
    }

    return a.name === b.name;
  }

  if (isEAbs(a) && isEAbs(b)) {
    return equivalence(a.body, b.body, [...ctxA, a.param], [...ctxB, b.param]);
  }

  if (isEApp(a) && isEApp(b)) {
    return (
      equivalence(a.func, b.func, ctxA, ctxB) &&
      equivalence(a.arg, b.arg, ctxA, ctxB)
    );
  }

  return false;
};

const FV = (expr: Expr, ctx: string[] = []): string[] => {
  if (isEVar(expr)) {
    const { name } = expr;

    if (ctx.includes(name)) {
      return [];
    }

    return [name];
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    return FV(body, [...ctx, param]);
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    return [...FV(func, ctx), ...FV(arg, ctx)];
  }

  throw new Error('Invalid expr');
};

const conversion = (expr: Expr, name: string, newName: string): Expr => {
  debug('conversion', prettyPrint(expr), name);

  if (isEVar(expr)) {
    if (expr.name === name) {
      return eVar(newName);
    }

    return expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    if (param === name) {
      return eAbs(newName, conversion(body, name, newName));
    }

    return expr;
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    return eApp(
      conversion(func, name, newName),
      conversion(arg, name, newName)
    );
  }

  throw new Error('Invalid expr');
};

const substitute = (expr: Expr, name: string, value: Expr): Expr => {
  debug('substitute', prettyPrint(expr), name, prettyPrint(value));

  if (isEVar(expr)) {
    if (expr.name === name) {
      return value;
    }

    return expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    if (param === name) {
      return expr;
    }

    const fvars = FV(value);

    if (fvars.includes(param)) {
      const newParam = `${param}'`;

      return substitute(conversion(expr, param, newParam), name, value);
    }

    return eAbs(param, substitute(body, name, value));
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    return eApp(substitute(func, name, value), substitute(arg, name, value));
  }

  throw new Error('Invalid expr');
};

export const interp = (expr: Expr): Expr => {
  debug('interp', prettyPrint(expr));

  if (isEVar(expr)) {
    return expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    return eAbs(param, interp(body));
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    if (isEAbs(func)) {
      const { param, body } = func;

      return interp(substitute(body, param, arg));
    }

    const newFunc = interp(func);
    const newArg = interp(arg);

    if (isEAbs(newFunc)) {
      return interp(eApp(newFunc, newArg));
    }

    return eApp(newFunc, newArg);
  }

  throw new Error('Invalid expr');
};
