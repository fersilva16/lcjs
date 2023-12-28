import { it, expect } from 'bun:test';

import { lambdaCalculus } from '..';

it.each([
  ['y', 'y'],
  ['x', 'x'],
  ['λy.y', 'λy.y'],
  ['x y', 'x y'],
  ['λy.λy.y', 'λy.λy.y'],
  ['λx.x y', 'λx.x y'],
  ['(λy.y) x', 'x'],
  ['(λy.y) λy.y', 'λy.y'],
  ['λy.y y', 'λy.y y'],
  ['(x x) y', '(x x) y'],
  ['x λy.y', 'x λy.y'],
  ['y (x x)', 'y (x x)'],
  ['(x x) (x x)', '(x x) (x x)'],
  ['λx.λy.x x', 'λx.λy.x x'],
  ['λx.(x λy.y)', 'λx.(x λy.y)'],
  ['λx.(x (x y))', 'λx.(x (x y))'],
  ['(λx.x y) (λx.x)', 'y'],
  ['((λx.λx.x) y) z', 'z'],
  ['λx.(λy.x) z', 'λx.x'],
])('should output %s for %s', (input, output) => {
  expect(lambdaCalculus(input)).toBe(output);
});
