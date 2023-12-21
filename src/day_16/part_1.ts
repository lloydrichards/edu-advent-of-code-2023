import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import * as O from "fp-ts/Option";

import input from "./input/input.txt";
import example from "./input/example.txt";
import { traceWithValue } from "fp-ts-std/Debug";

const parseTiles = flow(
  S.split(/\n/),
  RNEA.map(S.trim),
  traceWithValue("rows: "),
  RNEA.map(flow(S.split(""), (x) => [...x])),
  (x) => [...x],
);

type Direction = ">" | "<" | "^" | "v";
type Beam = {
  pos: [number, number];
  dir: Direction;
  value: string;
  path: Array<[number, number]>;
};
const foldBeam =
  <T>(
    up: (pt: [number, number]) => T,
    right: (pt: [number, number]) => T,
    down: (pt: [number, number]) => T,
    left: (pt: [number, number]) => T,
  ) =>
  (beam: Beam) => {
    switch (beam.dir) {
      case "<":
        return left([beam.pos[0] - 1, beam.pos[1]]);
      case ">":
        return right([beam.pos[0] + 1, beam.pos[1]]);
      case "^":
        return up([beam.pos[0], beam.pos[1] - 1]);
      case "v":
        return down([beam.pos[0], beam.pos[1] + 1]);
    }
  };

const goForward =
  (map: string[][]) =>
  (cur: Beam): Beam =>
    pipe(
      cur,
      foldBeam(
        (pt) => ({
          pos: pt,
          dir: cur.dir,
          value: map[pt[1]]?.[pt[0]],
          path: [...cur.path, cur.pos],
        }),
        (pt) => ({
          pos: pt,
          dir: cur.dir,
          value: map[pt[1]]?.[pt[0]],
          path: [...cur.path, cur.pos],
        }),
        (pt) => ({
          pos: pt,
          dir: cur.dir,
          value: map[pt[1]]?.[pt[0]],
          path: [...cur.path, cur.pos],
        }),
        (pt) => ({
          pos: pt,
          dir: cur.dir,
          value: map[pt[1]]?.[pt[0]],
          path: [...cur.path, cur.pos],
        }),
      ),
    );

const newBeam = (beam: Beam): Record<string, Beam> => ({
  left: {
    ...beam,
    dir: "<",
  },
  down: {
    ...beam,
    dir: "v",
  },
  right: {
    ...beam,
    dir: ">",
  },
  up: {
    ...beam,
    dir: "^",
  },
});

const nextDirection =
  (map: string[][]) =>
  (beam: Beam): Array<Beam> => {
    const { up, down, left, right } = newBeam(beam);
    switch (beam.value) {
      case "7":
        return foldBeam<Array<Beam>>(
          () => [left],
          () => [down],
          () => [right],
          () => [up],
        )(beam);
      case "/":
        return foldBeam<Array<Beam>>(
          () => [right],
          () => [up],
          () => [left],
          () => [down],
        )(beam);
      case "|":
        return foldBeam<Array<Beam>>(
          () => [up],
          () => [up, down],
          () => [down],
          () => [up, down],
        )(beam);
      case "-":
        return foldBeam<Array<Beam>>(
          () => [left, right],
          () => [right],
          () => [left, right],
          () => [left],
        )(beam);
      case "|":
        return foldBeam<Array<Beam>>(
          () => [up],
          () => [up, down],
          () => [down],
          () => [up, down],
        )(beam);

      default:
        return foldBeam<Array<Beam>>(
          () => [up],
          () => [right],
          () => [down],
          () => [left],
        )(beam);
    }
  };

const validBeamPosition = (map: string[][]) => (beam: Beam) => {
  const crossPath = beam.path.toString().includes(beam.pos.toString());
  const withinX = 0 <= beam.pos[0] && beam.pos[0] <= map[0].length;
  const withinY = 0 <= beam.pos[1] && beam.pos[1] <= map.length;
  return withinX && withinY && !crossPath;
};

const traceBeam =
  (start: Beam) =>
  (map: string[][]): { map: string[][]; beams: Array<Beam> } =>
    pipe(
      start,
      //   traceWithValue("start: "),
      goForward(map),
      //   traceWithValue("cur: "),
      nextDirection(map),
      //   traceWithValue("next: "),
      A.flatMap(
        flow(
          O.fromPredicate(validBeamPosition(map)),
          O.match(
            () => [start],
            (newBeam) => traceBeam(newBeam)(map).beams,
          ),
        ),
      ),
      (x) => ({
        map,
        beams: x,
      }),
    );

export const main = (input: string) =>
  pipe(
    input,
    traceWithValue("input: "),
    parseTiles,
    traceBeam({ pos: [0, 0], dir: ">", value: "", path: [] }),
    ({ map, beams }) => {
      const paintedMap = [...map.map((s) => [...s])];
      beams
        .flatMap((x) => x.path)
        .forEach(([x, y]) => {
          paintedMap[y][x] = "#";
        });
      console.log("-----");
      console.log(paintedMap.map((r) => r.join("")).join("\n"));
      return beams;
    },
    (x) => [...new Set(x)],
    A.size,
  );

// console.log(main(input)); // Output:
