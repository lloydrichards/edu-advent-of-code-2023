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
  A.map(N.fromString),
  A.map(O.getOrElse(() => 0)),
);
const numberOfGames = flow(
  S.split(":"),
  (x) => x[1],
  S.trim,
  S.words,
  (x) => x.filter((x) => x !== "").length,
);

const separateGames = (input: string, gameNumber: number) =>
  pipe(input, S.split("\n"), RNEA.map(stringToArrayOfNumbers), (x) => ({
    id: gameNumber,
    time: x[0][gameNumber],
    record: x[1][gameNumber],
  }));

const parseGames = (input: string) =>
  pipe(
    input,
    S.split("\n"),
    (x) => numberOfGames(x[0]),
    (x) => Array.from({ length: x }, (_, i) => separateGames(input, i)),
  );

const simulateRaces = (race: { id: number; time: number; record: number }) =>
  pipe(
    Array.from({ length: race.time }),
    A.mapWithIndex((i) => i * (race.time - i)),
    A.filter((d) => d > race.record),
    A.size,
  );

export const main = (input: string) =>
  pipe(
    input,
    parseGames,
    A.map(simulateRaces),
    A.reduce(1, (a, b) => a * b),
  );

// console.log(`Part 1: ${main(input)}`);
