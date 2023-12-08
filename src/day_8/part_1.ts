import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as R from "fp-ts/Record";

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
  (start: { current: string; steps: number }) =>
  (map: ReturnType<typeof parseMap>): { current: string; steps: number } =>
    pipe(
      map.path,
      RNEA.reduceWithIndex(start, (idx, state, next) => {
        const nextNode = map.nodes[state.current][next];
        if (idx == map.path.length - 1 && nextNode !== "ZZZ") {
          return travelMap({
            current: nextNode,
            steps: state.steps + 1,
          })(map);
        }
        return {
          current: nextNode,
          steps: state.steps + 1,
        };
      }),
    );

export const main = (input: string) =>
  pipe(
    input,
    parseMap,
    travelMap({
      current: "AAA",
      steps: 0,
    }),
    (x) => x.steps,
  );

// console.log(`Part 1: ${main(input)}`);
