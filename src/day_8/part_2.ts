import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as R from "fp-ts/Record";
import * as A from "@fp-ts/array";

import input from "./input/input.txt";

const parsePath = flow(
  S.split(""),
  RNEA.map((x) => (x == "L" ? 0 : 1)),
);

const parseNodes = flow(
  S.split("\n"),
  RNEA.map(
    flow(S.split(" = "), (parts) => [
      parts[0],
      pipe(parts[1], S.replace("(", ""), S.replace(")", ""), S.split(", ")),
    ]),
  ),
  (x) => [...x] as [string, string[]][],
  R.fromEntries,
);

const parseMap = flow(S.split("\n\n"), (parts) => ({
  path: parsePath(parts[0]),
  nodes: parseNodes(parts[1]),
}));

const travelMap =
  (map: ReturnType<typeof parseMap>) =>
  (start: {
    current: string;
    steps: number;
  }): { current: string; steps: number } =>
    pipe(
      map.path,
      RNEA.reduceWithIndex(start, (idx, state, next) => {
        const nextNode = map.nodes[state.current][next];
        if (idx == map.path.length - 1 && nextNode.at(-1) !== "Z") {
          return travelMap(map)({
            current: nextNode,
            steps: state.steps + 1,
          });
        }
        return {
          current: nextNode,
          steps: state.steps + 1,
        };
      }),
    );

const findStartingPaths = (map: ReturnType<typeof parseMap>) =>
  pipe(
    map.nodes,
    R.keys,
    A.filter((x) => x.at(-1) == "A"),
    A.map((x) => ({
      current: x,
      steps: 0,
    })),
  );

export const main = (input: string) =>
  pipe(input, parseMap, (map) =>
    pipe(
      findStartingPaths(map),
      A.map(travelMap(map)),
      A.map((x) => x.steps),
      A.reduce(1, (a, b) => {
        const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
        return (a * b) / gcd(a, b);
      }),
    ),
  );

// console.log(`Part 2: ${main(input)}`);
