import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RA from "fp-ts/ReadonlyArray";
import * as A from "fp-ts/Array";
import * as N from "@fp-ts/number";

import input from "./input/input.txt";

const parseInstructions: (s: string) => Instructions = flow(
  S.split("\n"),
  RA.map(
    flow(S.split(" "), ([_, __, color]) =>
      pipe(
        color,
        S.dropLeft(2),
        S.dropRight(1),
        S.splitAt(-1),
        ([steps, dir]) => ({ dir, steps: parseInt(steps, 16) }),
      ),
    ),
  ),
  RA.toArray,
);

type Instructions = { dir: string; steps: number }[];

const nextPos = (
  [x, y]: [number, number],
  steps: number,
): Record<string, [number, number]> => ({
  3: [x, y - steps],
  1: [x, y + steps],
  2: [x - steps, y],
  0: [x + steps, y],
});

const processInstructions = (instructions: Instructions): [number, number][] =>
  pipe(
    instructions,
    A.reduce([[0, 0]] as [number, number][], (a, { dir, steps }) => {
      const last = a.at(-1) || [0, 0];
      const next = nextPos(last, steps)[dir];
      return [...a, next];
    }),
  );

const calcParimeter = (instructions: Instructions) =>
  pipe(
    instructions,
    A.reduce(0, (a, { steps }) => a + steps),
  );

const shoelaceFormula = (points: [number, number][]) =>
  pipe(
    points,
    A.reduceWithIndex(0, (i, a, [x, _]) => {
      const lastY = points.at(i - 1)?.[1] || 0;
      const nextY = points.at((i + 1) % points.length)?.[1] || 0;
      return a + x * (nextY - lastY);
    }),
    (n) => Math.abs(n),
    N.divide(2),
  );

const picksTheorem = (area: number, points: number) => area - points / 2 + 1;

export const main = (input: string) =>
  pipe(
    input,
    parseInstructions,
    (instructions) => ({
      points: processInstructions(instructions),
      parimeter: calcParimeter(instructions),
    }),
    ({ points, parimeter }) =>
      picksTheorem(shoelaceFormula(points), parimeter) + parimeter,
  );

// console.log(main(input)); // Output: 90111113594927
