import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RA from "fp-ts/ReadonlyArray";
import * as A from "fp-ts/Array";
import * as N from "@fp-ts/number";
import * as O from "fp-ts/Option";

import input from "./input/input.txt";
import { traceWithValue } from "fp-ts-std/Debug";
import { min } from "fp-ts/lib/ReadonlyNonEmptyArray";

const parseInstructions: (s: string) => Instructions = flow(
  S.split("\n"),
  RA.map(flow(S.split(" "), ([dir, steps]) => ({ dir, steps: +steps }))),
  RA.toArray,
);

type Trench = { cur: [number, number]; map: number[][] };
type Instructions = { dir: string; steps: number }[];
type Grid = string[][];
const nextPos = ([x, y]: [number, number]): Record<
  string,
  [number, number]
> => ({
  U: [x, y - 1],
  D: [x, y + 1],
  L: [x - 1, y],
  R: [x + 1, y],
});

const dig = (trench: Trench, { dir }: { dir: string }): Trench =>
  pipe(trench, ({ cur, map }) => {
    const next = nextPos(cur)[dir];
    const [nx, ny] = next;
    const row = map[ny] || [];
    const nextMap = [
      ...map.slice(0, ny),
      [...row.slice(0, nx), next[0], ...row.slice(nx)],
      ...map.slice(ny + 1),
    ];
    return { cur: next, map: nextMap };
  });

const fillRow = (min: number, max: number) => (row: number[]) =>
  pipe(
    Array(max + 1 - min).fill("."),
    A.mapWithIndex((i, c) => (row.includes(i + min) ? "#" : c)),
  );

const expandGrid = (
  grid: Grid,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): Grid => {
  const newHeight = grid.length - minY + 1;
  const newWidth = grid[0].length - minX + 1;

  let newGrid: Grid = Array(newHeight)
    .fill(null)
    .map(() => Array(newWidth).fill("."));
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      newGrid[y - minY][x - minX] = grid[y][x];
    }
  }

  return newGrid;
};

const processInstructions = (instructions: Instructions): Grid => {
  let grid: Grid = [["S"]];
  let x = 0;
  let y = 0;
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;

  instructions.forEach((instruction) => {
    for (let i = 0; i < instruction.steps; i++) {
      switch (instruction.dir) {
        case "U":
          y--;
          break;
        case "D":
          y++;
          break;
        case "L":
          x--;
          break;
        case "R":
          x++;
          break;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
        grid = expandGrid(grid, minX, minY, maxX, maxY);
        x -= minX;
        y -= minY;
      }

      grid[y][x] = "#";
    }
  });

  return grid;
};

const digTrench = (instructions: Instructions) =>
  pipe(
    instructions,
    A.reduce({ cur: [0, 0], map: [] as number[][] }, dig),
    (a) => {
      const max = a.map.reduce((a, b) => Math.max(a, ...b), 0);
      const min = a.map.reduce((a, b) => Math.min(a, ...b), Infinity);
      return pipe(a.map, A.map(fillRow(min, max)));
    },
  );

const fillTrench = (trench: string[][]) =>
  pipe(
    trench,
    A.map((row) =>
      pipe(
        row,
        A.mapWithIndex((i, c) => {
          if (c === "#") return c;
          const prev = row.slice(0, i).join("");
          const next = row.slice(i + 1).join("");
          const linesBefore = (prev.match(/#+/g)?.length || 0) % 2 != 0;
          const linesAfter = (next.match(/#+/g)?.length || 0) % 2 != 0;

          return linesBefore && linesAfter ? "#" : c;
        }),
      ),
    ),
  );

const trenchSize = (trench: string[][]) =>
  pipe(trench, A.map(A.filter((x) => x === "#")), A.flatten, A.size);

export const main = (input: string) =>
  pipe(
    input,
    parseInstructions,
    processInstructions,
    fillTrench,
    (x) => {
      // console.log(x.map((x) => x.join("")).join("\n"));
      return x;
    },
    trenchSize,
  );

// console.log(main(input)); // Output:
