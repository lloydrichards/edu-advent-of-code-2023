import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";

import input from "./input/input.txt";
import example from "./input/example.txt";

const parseUniverse = flow(S.split("\n"), RNEA.map(S.split("")), (map) =>
  map.map((rows, y) =>
    rows.map((value, x) => ({ galaxy: value == "#", x, y })),
  ),
);

const identifyGalaxies = (universe: { galaxy: boolean }[][]) =>
  pipe(
    universe,
    A.mapWithIndex((y, row) => row.map((col, x) => ({ ...col, x, y }))),
    A.flatMap((row) => row.filter(({ galaxy }) => galaxy)),
  );

const universeGrowth = (
  universe: { galaxy: boolean; x: number; y: number }[][],
) =>
  pipe(universe, (u) => ({
    emptyCol: universe[0]
      .filter((_, idx) => universe.every((row) => !row[idx].galaxy))
      .map((c) => c.x),
    emptyRow: universe
      .filter((row) => row.every(({ galaxy }) => !galaxy))
      .map((r) => r[0].y),
  }));

const calculateDistance =
  (universe: { galaxy: boolean; x: number; y: number }[][], multiple: number) =>
  (pairs: [[number, number], [number, number]][]) =>
    pipe(
      universeGrowth(universe),
      (empty) =>
        pipe(
          pairs,
          A.map((pair) => {
            const [p1, p2] = pair;
            const eR = empty.emptyRow.filter((r) => r >= p1[1] && r <= p2[1]);
            const eC = empty.emptyCol.filter((c) => c >= p1[0] && c <= p2[0]);
            return { p1, p2, eR, eC };
          }),
        ),
      A.map(({ p1, p2, eC, eR }) => {
        const x = Math.abs(p1[0] - p2[0]);
        const y = Math.abs(p1[1] - p2[1]);
        const xExpand = eC.length > 0 ? eC.length * (multiple - 1) : 0;
        const yExpand = eR.length > 0 ? eR.length * (multiple - 1) : 0;
        return x + xExpand + y + yExpand;
      }),
    );

const pairGalaxies = (galaxies: { galaxy: boolean; x: number; y: number }[]) =>
  pipe(
    galaxies,
    A.flatMap((galaxy, idx) =>
      galaxies.slice(idx + 1).map(
        (w) =>
          [
            [Math.min(galaxy.x, w.x), Math.min(galaxy.y, w.y)],
            [Math.max(galaxy.x, w.x), Math.max(galaxy.y, w.y)],
          ] as [[number, number], [number, number]],
      ),
    ),
  );

export const main = (multiple: number) => (input: string) =>
  pipe(
    input,
    parseUniverse,
    (universe) =>
      pipe(
        universe,
        identifyGalaxies,
        pairGalaxies,
        calculateDistance(universe, multiple),
      ),
    A.reduce(0, (acc, x) => acc + x),
  );

// console.log(main(1_000_000)(input)); // Output: 597714117556
