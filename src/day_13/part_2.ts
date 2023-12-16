import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import * as O from "fp-ts/Option";
import * as N from "fp-ts/number";

import input from "./input/input.txt";

import { traceWithValue } from "fp-ts-std/Debug";

const parseMirrors = flow(
  S.split("\n\n"),
  RNEA.map(
    flow(S.split("\n"), RNEA.map(flow(S.split(""), (x) => [...x])), (x) => [
      ...x,
    ]),
  ),
);
const checkMirror = (rows: string[]) => (idx: number) =>
  pipe(
    rows,
    A.reduceWithIndex([[], []] as string[][], (i, acc, row) =>
      i >= idx ? [acc[0], [...acc[1], row]] : [[...acc[0], row], acc[1]],
    ),
    ([before, after]) => {
      const minLen = Math.min(before.length, after.length);
      const flipSlice = after.slice(0, minLen).toReversed();
      const beforeSlice = before.slice(-minLen, -1);
      return [beforeSlice, flipSlice];
    },
    ([before, after]) =>
      before.map((x, i) => {
        return x == after[i];
      }),
    (arr) => {
      const f = arr.filter((x) => !x);
      return f.length <= 1;
    },
  );

const checkForMirrorForSmudge = (rows: string[][]) =>
  pipe(
    rows,
    A.map((rows) => rows.join("")),
    (r) =>
      pipe(
        r,
        A.reduceWithIndex([] as number[][], (i, acc, row) => {
          const allDiffs = r
            .map((o, posX) =>
              row
                .split("")
                .map((x, idx) => ({ dif: x != o[idx], idx: posX }))
                .filter((x) => x.dif),
            )
            .filter((x) => x.length == 1);

          if (allDiffs.length == 1) {
            console.log("---");
            console.log(allDiffs);
            console.log(allDiffs[0][0].idx);
            return [...acc, [i, allDiffs[0][0].idx]];
          }
          return acc;
        }),
        traceWithValue("Smudge At: "),
      ),
    (smudgeIdx) => {
      // const smudge = rows[smudgeIdx[0][1]][smudgeIdx[0][0]];
      console.log(`Smudge:  at ${smudgeIdx[0]}`);
      return rows;
    },
  );
const checkForMirror = (rows: string[][]) =>
  pipe(
    rows,
    A.map((rows) => rows.join("")),
    (r) =>
      pipe(
        r,
        A.reduceWithIndex([] as number[], (i, acc, row) => {
          if (i != 0 && r[i - 1] == row) return [...acc, i];
          return acc;
        }),
        A.map(flow(O.fromPredicate(checkMirror(r)))),
        A.filter(O.isSome),
        A.map(O.getOrElseW(() => 0)),
        O.fromPredicate((x) => x.length > 0),
        O.map((x) => Math.max(...x)),
      ),
  );
const checkColumns = (input: string) => (map: string[][]) =>
  pipe(
    map,
    pivotColumns,
    checkForMirrorForSmudge,
    checkForMirror,
    O.getOrElse(() => 0),
  );

const pivotColumns = (mirrors: string[][]) => {
  const columns = mirrors[0].map((_, i) => mirrors.map((row) => row[i]));
  return columns;
};

export const main = (input: string) =>
  pipe(
    input,
    parseMirrors,
    RNEA.map((map) =>
      pipe(
        map,
        checkForMirrorForSmudge,
        checkForMirror,
        O.match(
          () =>
            pipe(checkColumns(input)(map), (columnIdx) => ({
              direction: "column",
              idx: columnIdx,
              value: columnIdx,
            })),
          (rowIdx) => ({ direction: "row", idx: rowIdx, value: rowIdx * 100 }),
        ),
      ),
    ),
    // traceWithValue("result:"),
    RNEA.reduce(0, (acc, x) => acc + x.value),
  );

// console.log(main(input)); // Output: 29165
