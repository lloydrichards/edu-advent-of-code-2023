import { flow, pipe } from "fp-ts/lib/function";
import * as A from "@fp-ts/array";
import * as N from "@fp-ts/number";
import * as S from "@fp-ts/string";
import * as O from "fp-ts/Option";
import { traceWithValue } from "fp-ts-std/Debug";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import input from "./input/input.txt";

const stringToArrayOfNumbers = flow(
  S.split(":"),
  (x) => x[1],
  S.trim,
  S.words,
  (x) => x.filter((x) => x !== ""),
  A.join(""),
  N.fromString,
  O.getOrElse(() => 0),
);

const separateGames = (input: string) =>
  pipe(input, S.split("\n"), RNEA.map(stringToArrayOfNumbers), (x) => ({
    time: x[0],
    record: x[1],
  }));

const parseGames = (input: string) => pipe(input, separateGames);

const simulateRaces = (race: { time: number; record: number }) =>
  pipe(
    Array.from({ length: race.time }),
    A.mapWithIndex((i) => i * (race.time - i)),
    A.filter((d) => d > race.record),
    A.size,
  );

export const main = (input: string) => pipe(input, parseGames, simulateRaces);

// console.log(`Part 2: ${main(input)}`);
