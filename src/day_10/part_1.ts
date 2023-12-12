import { flow, identity, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/lib/number";
import { traceWithValue } from "fp-ts-std/Debug";

import input from "./input/input.txt";

const findStart = (map: string[][]) =>
  pipe(
    map,
    A.findIndex((row) => row.includes("S")),
    O.chain((row) =>
      pipe(
        map[row],
        A.findIndex((col) => col === "S"),
        O.map((col) => [row, col] as [number, number]),
      ),
    ),
  );

const parseMap = flow(
  S.split("\n"),
  RNEA.map(S.split("")),
  (map) => map.map((x) => [...x]),
  (map) => ({
    map,
    start: findStart(map),
  }),
);

const routes = (row: number, col: number, map: string[][]) => [
  map[row - 1] ? { value: map[row - 1][col], row: row - 1, col } : undefined,
  [col + 1] ? { value: map[row][col + 1], row, col: col + 1 } : undefined,
  [row + 1] ? { value: map[row + 1][col], row: row + 1, col } : undefined,
  [col - 1] ? { value: map[row][col - 1], row, col: col - 1 } : undefined,
];
const up = ["|", "F", "7", "S"];
const down = ["|", "J", "L", "S"];
const left = ["-", "L", "F", "S"];
const right = ["-", "J", "7", "S"];

const validRoutes: Record<string, string[][]> = {
  "|": [up, [], down, []],
  "-": [[], right, [], left],
  L: [up, right, [], []],
  J: [up, [], [], left],
  "7": [[], [], down, left],
  F: [[], right, down, []],
  S: [up, right, down, left],
  ".": [[], [], [], []],
};

const validRoute = (
  route: { value: string; row: number; col: number },
  map: string[][],
) => {
  const { value, row, col } = route;
  if (value == undefined) return false;
  const [up, right, down, left] = validRoutes[value];
  const [upValue, rightValue, downValue, leftValue] = routes(row, col, map);
  const upValid = up.includes(upValue?.value || "");
  const rightValid = right.includes(rightValue?.value || "");
  const downValid = down.includes(downValue?.value || "");
  const leftValid = left.includes(leftValue?.value || "");
  return (
    [upValid, rightValid, downValid, leftValid].filter(Boolean).length == 2
  );
};

const findValidRoutes = ({
  start,
  map,
}: {
  start: O.Option<[number, number]>;
  map: string[][];
}) =>
  pipe(
    start,
    O.map(([row, col]) =>
      pipe(
        routes(row, col, map),
        A.map(O.fromPredicate(Boolean)),
        A.map((branch) =>
          pipe(
            branch,
            O.chain(O.fromPredicate((route) => validRoute(route!, map))),
            O.map((route) => [route!.row, route!.col] as [number, number]),
          ),
        ),
      ),
    ),
    O.match(() => [], identity),
  );

const mapRoute =
  (map: string[][], before: [number, number]) =>
  (start: [number, number]): number => {
    const value = map[start[0]][start[1]];
    switch (value) {
      case "F":
        if (start[0] === before[0]) {
          return 1 + mapRoute(map, start)([start[0] + 1, start[1]]);
        }
        return 1 + mapRoute(map, start)([start[0], start[1] + 1]);
      case "J":
        if (start[0] === before[0]) {
          return 1 + mapRoute(map, start)([start[0] - 1, start[1]]);
        }
        return 1 + mapRoute(map, start)([start[0], start[1] - 1]);
      case "7":
        if (start[0] === before[0]) {
          return 1 + mapRoute(map, start)([start[0] + 1, start[1]]);
        }
        return 1 + mapRoute(map, start)([start[0], start[1] - 1]);
      case "L":
        if (start[0] === before[0]) {
          return 1 + mapRoute(map, start)([start[0] - 1, start[1]]);
        }
        return 1 + mapRoute(map, start)([start[0], start[1] + 1]);
      case "|":
        if (start[0] === before[0] + 1) {
          return 1 + mapRoute(map, start)([start[0] + 1, start[1]]);
        }
        return 1 + mapRoute(map, start)([start[0] - 1, start[1]]);
      case "-":
        if (start[1] === before[1] + 1) {
          return 1 + mapRoute(map, start)([start[0], start[1] + 1]);
        }
        return 1 + mapRoute(map, start)([start[0], start[1] - 1]);
      default:
        return 1;
    }
  };

export const main = (input: string) =>
  pipe(
    input,
    parseMap,
    findValidRoutes,
    A.map(
      flow(
        O.chain((route) =>
          pipe(
            route,
            mapRoute(
              parseMap(input).map,
              O.getOrElse(() => [0, 0] as [number, number])(
                parseMap(input).start,
              ),
            ),
            O.fromPredicate(Boolean),
          ),
        ),
        O.match(() => 0, identity),
      ),
    ),
    (x) => Math.max(...x),
    (x) => x / 2,
  );

// console.log(main(input)); // Output: 7012
