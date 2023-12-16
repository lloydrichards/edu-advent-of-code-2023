import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as A from "@fp-ts/array";
import * as O from "fp-ts/Option";

import input from "./input/input.txt";
import { traceShowWithValue, traceWithValue } from "fp-ts-std/Debug";

const computeSpring = flow(S.split(" "), (s) => ({
  sequence: s[0],
  brokenCount: s[1].split(",").map(Number),
}));
const parseStrings = flow(S.split("\n"), RNEA.map(computeSpring));
const getUnknown = flow(
  S.split(""),
  RNEA.mapWithIndex((i, c) => ({
    index: i,
    char: c,
  })),
  RNEA.filter((c) => c.char === "?"),
  O.map((c) => c.map((c) => c.index)),
);

const allCombinations = (sequence: string) => (unknownIdxs: number[]) => {
  const combinations = A.range(0, 2 ** unknownIdxs.length - 1)
    .map((i) => i.toString(2).padStart(unknownIdxs.length, "0").split(""))
    .map((c) => c.map((c) => (c === "0" ? "." : "#")));
  return combinations.map((c) => {
    const chars = sequence.split("");
    unknownIdxs.forEach((idx, i) => {
      chars[idx] = c[i];
    });
    return chars.join("");
  });
};

const validSequence = (brokenCount: number[]) =>
  flow(
    S.split("."),
    RNEA.filter(Boolean),
    O.map(
      RNEA.mapWithIndex((idx, part) => {
        const count = brokenCount[idx];
        return part.length == count;
      }),
    ),
    O.match(
      () => false,
      (x) => x.length == brokenCount.length && x.every(Boolean),
    ),
  );

const emulateArrangements = (spring: ReturnType<typeof computeSpring>) =>
  pipe(
    spring.sequence,
    getUnknown,
    O.map(
      flow(
        allCombinations(spring.sequence),
        A.map(validSequence(spring.brokenCount)),
        A.filter(Boolean),
        A.size,
      ),
    ),
    O.getOrElse(() => 1),
  );

export const main = (input: string) =>
  pipe(
    input,
    parseStrings,
    RNEA.map(emulateArrangements),
    RNEA.reduce(0, (a, b) => a + b),
  );

// console.log(main(input)); // Output: 7344
