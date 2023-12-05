import { flow, pipe } from "fp-ts/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as N from "@fp-ts/number";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as A from "@fp-ts/array";
import { traceWithValue } from "fp-ts-std/Debug";
import input from "./input/input.txt";

type RuleMap = {
  source: [number, number];
  dest: [number, number];
  offset: number;
};
const stringToArrayOfNumbers = flow(
  S.words,
  RNEA.map(N.fromString),
  RNEA.map(O.getOrElse(() => 0)),
);

const parseSeeds = flow(S.split(": "), RNEA.last, stringToArrayOfNumbers);
const parseRules = flow(
  S.split(":\n"),
  RNEA.last,
  S.split("\n"),
  RNEA.map(stringToArrayOfNumbers),
  RNEA.map((x) => ({
    source: [x[1], x[1] + x[2]] as [number, number],
    dest: [x[0], x[0] + x[2]] as [number, number],
    offset: x[0] - x[1],
  })),
);

const parseAlmanac = (input: string) =>
  pipe(input, S.split("\n\n"), (x) => ({
    seeds: parseSeeds(x[0]),
    rules: x.slice(1).map(parseRules),
  }));

const offsetNumber =
  (converter: RNEA.ReadonlyNonEmptyArray<RuleMap>) => (startNumber: number) =>
    pipe(
      converter.find(
        ({ source }) => source[0] <= startNumber && startNumber <= source[1],
      ),
      O.fromNullable,
      O.map(({ offset }) => startNumber + offset),
      O.match(
        () => startNumber,
        (x) => x,
      ),
    );

const convertSeedToLocation =
  (almanac: ReturnType<typeof parseAlmanac>) => (seed: number) =>
    pipe(
      almanac.rules,
      A.reduce(seed, (score, rule) => offsetNumber(rule)(score)),
    );

export const main = (input: string) =>
  pipe(input, parseAlmanac, (almanac) =>
    pipe(
      almanac.seeds,
      RNEA.map(convertSeedToLocation(almanac)),
      RNEA.min(N.Ord),
    ),
  );

// console.log(`Part 1: ${main(input)}`);
