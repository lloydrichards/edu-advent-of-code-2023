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

const findSequence =
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
          acc = findSequence(step + 1)({ sequence: acc[step], diffs: acc });
        }
        return acc;
      }),
    );

const nextValue = (row: { sequence: number[]; diffs: number[][] }) =>
  pipe(
    row.diffs,
    A.reduceRight(0, (cur, acc) => {
      return acc + (cur.at(-1) || 0);
    }),
    (value) => (row.sequence.at(-1) || 0) + value,
  );

export const main = (input: string) =>
  pipe(
    input,
    parseRows,
    RNEA.map((row) => ({
      sequence: row.sequence,
      diffs: findSequence(0)(row),
    })),
    RNEA.map(nextValue),
    RNEA.reduce(0, (acc, cur) => acc + cur),
  );

//   console.log(`Part 1: ${main(input)}`);
