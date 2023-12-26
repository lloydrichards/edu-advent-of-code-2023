import { flow, identity, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RA from "fp-ts/ReadonlyArray";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import * as N from "fp-ts/number";

import input from "./input/input.txt";

const parseMap = flow(S.split("\n"), RA.map(flow(S.split(""), RA.toArray)));
const findIndexOfStart = (map: readonly string[][]): [number, number] =>
  pipe(
    map,
    RA.findIndex((row) => row.includes("S")),
    O.map((index) => [map[index].indexOf("S"), index] as [number, number]),
    O.match(() => {
      throw new Error("No start found");
    }, identity),
  );

const next = (x: number, y: number): [number, number][] => {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
};
const nextPlots = (map: readonly string[][]) => (cur: [number, number]) =>
  pipe(
    next(...cur),
    RA.filter(([x, y]) => map[y]?.[x] !== "#"),
    RA.toArray,
  );

const tupleEq = <A, B>(a: Ord.Ord<A>, b: Ord.Ord<B>): Ord.Ord<[A, B]> =>
  pipe(Ord.tuple(a, b));

const stepCounter = (steps: number) => (map: readonly string[][]) =>
  pipe(
    Array.from({ length: steps }, (_, i) => i + 1),
    A.reduce([findIndexOfStart(map)], (acc, _) => {
      return pipe(
        acc,
        A.flatMap(nextPlots(map)),
        A.uniq(tupleEq(N.Ord, N.Ord)),
      );
    }),
  );

export const main = (steps: number) => (input: string) =>
  pipe(input, parseMap, stepCounter(steps), A.size);

// console.log(main(64)(input)); // Output: 3687
