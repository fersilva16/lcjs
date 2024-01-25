import { it, expect } from 'bun:test';

import { lambdaCalculus } from '..';

it('should return var if not reducible', () => {
  expect(lambdaCalculus('y')).toBe('y');
});

it('should return abs if not reducible with var inside', () => {
  expect(lambdaCalculus('λy.y')).toBe('λy.y');
});

it('should return abs if not reducible with abs inside', () => {
  expect(lambdaCalculus('λy.λy.y')).toBe('λy.λy.y');
});

it('should return abs if not reducible with app inside', () => {
  expect(lambdaCalculus('λy.y y')).toBe('λy.y y');
});

it('should return app if not reducible with var and var', () => {
  expect(lambdaCalculus('x y')).toBe('x y');
});

it('should return app if not reducible with var and abs', () => {
  expect(lambdaCalculus('x λy.y')).toBe('x λy.y');
});

it('should return app if not reducible with var and app', () => {
  expect(lambdaCalculus('y (x x)')).toBe('y (x x)');
});

it('should return app if not reducible with app and var', () => {
  expect(lambdaCalculus('(x x) y')).toBe('(x x) y');
});

it('should return app if not reducible with app and app', () => {
  expect(lambdaCalculus('(x x) (x x)')).toBe('(x x) (x x)');
});

it('should reduce app with abs and var', () => {
  expect(lambdaCalculus('(λy.y) x')).toBe('x');
});

it('should reduce app with abs and abs', () => {
  expect(lambdaCalculus('(λy.y) λy.y')).toBe('λy.y');
});

it('should reduce app with abs and abs and then reduce with abs and var', () => {
  expect(lambdaCalculus('(λx.x y) (λx.x)')).toBe('y');
});

it('should reduce app inside an abs', () => {
  expect(lambdaCalculus('λx.(λy.x) z')).toBe('λx.x');
});

it('should reduce all abs after reducing', () => {
  expect(lambdaCalculus('((λx.x) (λx.y x)) x')).toBe('y x');
});

it('should not shadow variables', () => {
  expect(lambdaCalculus('(λx.λx.x) y')).toBe('λx.x');
});

it('should rename the abs param if a collision occurs', () => {
  expect(lambdaCalculus('(λx.λy.x) y')).toBe("λy'.y");
});

it('should rename the abs param if a collision occurs within an abs', () => {
  expect(lambdaCalculus('(λx.λy.x y) λz.y')).toBe("λy'.y");
});

it('should rename the abs param if a collision occurs within an app', () => {
  expect(lambdaCalculus('(λx.λy.x) (y x)')).toBe("λy'.y x");
});

it('should rename variables if a collision occurs', () => {
  expect(lambdaCalculus('(λx.λy.x y) y')).toBe("λy'.y y'");
});

it('should rename variables if a collision occurs within an abs', () => {
  expect(lambdaCalculus('(λx.λy.y x) λz.y')).toBe("λy'.(y' λz.y)");
});

it('should rename variables if a collision occurs within an app', () => {
  expect(lambdaCalculus('(λx.λy.y x) (y x)')).toBe("λy'.(y' (y x))");
});
