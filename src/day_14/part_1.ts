import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";

import input from "./input/input.txt";
import example from "./input/example.txt";

const parseRockField = flow(
  S.split("\n"),
  RNEA.map(flow(S.split(""), (x) => [...x])),
  (x) => [...x],
);

const rollRowNorth = (map: string[][]) => (row: [number, number][]) =>
  pipe(
    row,
    A.reduceWithIndex(map, (i, acc, [c, r]) => {
      if (r == 0) return acc;
      const prev = acc[r][c];
      const next = acc[r - 1][c];
      if (prev == "." || prev == "#") return acc;
      if (next == ".") {
        acc[r][c] = next;
        acc[r - 1][c] = prev;
      }
      return acc;
    }),
  );

const tiltNorth = (map: string[][]): string[][] =>
  pipe(
    map,
    A.mapWithIndex((r, row) => row.map((_, c) => [c, r] as [number, number])),
    A.reduceWithIndex([...map.map((s) => [...s])], (i, curMap, row) => {
      const newMap = rollRowNorth(curMap)(row);
      const isSame = newMap.every((r, i) => r.join("") == map[i].join(""));
      if (i == map.length - 1 && !isSame) {
        return tiltNorth(newMap);
      }
      return newMap;
    }),
  );

const calculateValues = (map: string[][]) =>
  pipe(
    map,
    A.mapWithIndex((i) => i + 1),
    A.reverse,
    A.mapWithIndex((i, v) => map[i].filter((s) => s == "O").length * v),
  );

export const main = (input: string) =>
  pipe(
    input,
    parseRockField,
    tiltNorth,
    calculateValues,
    A.reduce(0, (a, c) => a + c),
  );

// console.log(main(example));
// console.log(main(input)); // Output: 109661
