import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import { traceWithValue } from "fp-ts-std/Debug";

import input from "./input/input.txt";
import example from "./input/example.txt";

const parseUniverse = flow(S.split("\n"), RNEA.map(S.split("")), (map) =>
  map.map((rows, y) => rows.map((value, x) => ({ galaxy: value == "#" }))),
);

const expandRows = (universe: { galaxy: boolean }[][]) =>
  pipe(
    universe,
    A.reduce([] as { galaxy: boolean }[][], (acc, row) => {
      const isEmpty = row.every(({ galaxy }) => !galaxy);
      return isEmpty ? [...acc, row, row] : [...acc, row];
    }),
  );

const expandColumns = (universe: { galaxy: boolean }[][]) =>
  pipe(
    universe,
    (x) => x[0],
    A.reduceRightWithIndex(universe, (idx, _row, acc) => {
      const isEmpty = universe.every((row) => !row[idx].galaxy);
      if (isEmpty) {
        acc.map((row) => row.splice(idx, 0, { galaxy: false }));
      }
      return acc;
    }),
    (x) =>
      x.map((row) => row.slice(0, Math.min(...universe.map((x) => x.length)))),
  );

const expandUniverse = (universe: { galaxy: boolean }[][]) =>
  pipe(universe, expandRows, expandColumns);

const identifyGalaxies = (universe: { galaxy: boolean }[][]) =>
  pipe(
    universe,
    A.mapWithIndex((y, row) => row.map((col, x) => ({ ...col, x, y }))),
    A.flatMap((row) => row.filter(({ galaxy }) => galaxy)),
  );

const pairGalaxies = (galaxies: { galaxy: boolean; x: number; y: number }[]) =>
  pipe(
    galaxies,
    A.flatMap((galaxy, idx) => galaxies.slice(idx + 1).map((w) => [galaxy, w])),
  );

export const main = (input: string) =>
  pipe(
    input,
    parseUniverse,
    expandUniverse,
    identifyGalaxies,
    pairGalaxies,
    A.map(([a, b]) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)),
    A.reduce(0, (acc, x) => acc + x),
  );

// console.log(main(input)); // Output: 9312968
