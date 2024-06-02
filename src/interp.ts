import { Expr, eAbs, eApp, eVar, isEAbs, isEApp, isEVar } from './data/Expr';
import { debug } from './utils/debug';

const FV = (expr: Expr, ctx: string[]): string[] => {
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

export const interp = (
  expr: Expr,
  ctx: Record<string, Expr> = {},
  fvs: string[] = []
): Expr => {
  debug('interp', expr, ctx);

  if (isEVar(expr)) {
    const { name } = expr;

    return ctx[name] || expr;
  }

  if (isEAbs(expr)) {
    const { param, body } = expr;

    if (ctx[param]) {
      return expr;
    }

    if (fvs.includes(param)) {
      return eAbs(
        `${param}'`,
        interp(interp(body, { [param]: eVar(`${param}'`) }), ctx)
      );
    }

    return eAbs(param, interp(body, ctx));
  }

  if (isEApp(expr)) {
    const { func, arg } = expr;

    if (isEAbs(func)) {
      const { param, body } = func;

      const argFvs = FV(arg, Object.keys(ctx));

      return interp(body, { ...ctx, [param]: arg }, [...fvs, ...argFvs]);
    }

    const newFunc = interp(func, ctx);
    const newArg = interp(arg, ctx);

    if (isEAbs(newFunc)) {
      const newArgFvs = FV(newArg, Object.keys(ctx));

      return interp(eApp(newFunc, newArg), ctx, [...fvs, ...newArgFvs]);
    }

    return eApp(newFunc, newArg);
  }

  throw new Error('Invalid expr');
};
