import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import { traceWithValue } from "fp-ts-std/Debug";

import input from "./input/input.txt";

const parseRows = flow(
  S.split("\n"),
  RNEA.map(
    flow(S.split(" "), RNEA.map(Number), (x) => ({
      sequence: [...x],
      diffs: [] as number[][],
    })),
  ),
);

const findSequenceNext =
  (step: number) => (row: { sequence: number[]; diffs: number[][] }) =>
    pipe(
      row.sequence,
      A.reduceWithIndex(row.diffs, (idx, acc, cur) => {
        if (idx == 0) {
          return acc;
        }
        const diff = cur - row.sequence[idx - 1];
        acc[step] = acc[step] ? [...acc[step], diff] : [diff];
        if (idx == row.sequence.length - 1 && !acc[step].every((x) => x == 0)) {
          acc = findSequenceNext(step + 1)({ sequence: acc[step], diffs: acc });
        }
        return acc;
      }),
    );
const findSequenceBefore =
  (step: number) => (row: { sequence: number[]; diffs: number[][] }) =>
    pipe(
      row.sequence,
      A.reduceWithIndex(row.diffs, (idx, acc, cur) => {
        if (idx == 0) {
          return acc;
        }
        const diff = cur - row.sequence[idx - 1];
        acc[step] = acc[step] ? [diff, ...acc[step]] : [diff];
        if (idx == row.sequence.length - 1 && !acc[step].every((x) => x == 0)) {
          acc = findSequenceBefore(step + 1)({
            sequence: acc[step],
            diffs: acc,
          });
        }
        return acc;
      }),
    );

const previousValue = (row: { sequence: number[]; diffs: number[][] }) =>
  pipe(
    [row.sequence, ...row.diffs],
    A.reduceRightWithIndex([row.sequence, ...row.diffs], (idx, cur, acc) => {
      const diff = idx == row.diffs.length ? 0 : cur[0] - acc[idx + 1][0];
      acc[idx] = [diff, ...cur];
      return acc;
    }),
    (x) => x[0][0],
  );

export const main = (input: string) =>
  pipe(
    input,
    parseRows,
    RNEA.map((row) => ({
      sequence: row.sequence,
      diffs: findSequenceNext(0)(row),
    })),
    RNEA.map(previousValue),
    RNEA.reduce(0, (acc, cur) => acc + cur),
  );

// console.log(`Part 2: ${main(input)}`);
