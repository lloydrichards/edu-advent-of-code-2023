import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";

const splitIntoArray = (input: string): string[] => input.split("\n");

const findSerialNumbers = (input: string) =>
  [...input.matchAll(/\d+/g)].map((x) => ({
    value: x[0],
    index: x.index!,
  }));

const findSymbols = (input: string) =>
  [...input.matchAll(/[^\d.]/g)]
    .map((x) => ({
      value: x[0],
      index: x.index!,
    }))
    .filter((x) => x.value === "*");

const clampIndexes = (row: string | undefined, index: number) =>
  O.some(
    row
      ? [Math.max(0, index - 1), index, Math.min(index + 1, row.length - 1)]
      : [],
  );

const findAdjacent =
  (schematic: string[], index: number) =>
  (symbol: { value: string; index: number }) =>
    pipe(
      O.Do,
      O.bind("above", () => clampIndexes(schematic[index - 1], symbol.index)),
      O.bind("same", () => clampIndexes(schematic[index], symbol.index)),
      O.bind("below", () => clampIndexes(schematic[index + 1], symbol.index)),
      O.bind("searchArea", ({ above, same, below }) =>
        O.some(
          [
            ...above.map((x) => [index - 1, x]),
            ...same.map((x) => [index, x]),
            ...below.map((x) => [index + 1, x]),
          ].filter((x) => x[0] >= 0 && x[0] <= schematic.length - 1),
        ),
      ),
      O.match(
        () => ({
          value: symbol.value,
          area: [] as [number, number][],
        }),
        (x) => ({
          value: symbol.value,
          area: x.searchArea as [number, number][],
        }),
      ),
    );
const parseSerialNumbers = (schematic: string[]) =>
  pipe(
    schematic,
    A.map(findSerialNumbers),
    A.mapWithIndex((i, x) =>
      x.map((y) => ({
        value: y.value,
        row: i,
        indexes: Array.from({ length: y.value.length }, (_, i) => i + y.index),
      })),
    ),
    A.flatten,
  );

const matchSerialNumbers =
  (allNumbersOnRow: { value: string; row: number; indexes: number[] }[]) =>
  (input: { value: string; area: [number, number][] }) =>
    pipe(
      input.area,
      A.map(
        ([row, idx]) =>
          allNumbersOnRow.find((x) => x.row === row && x.indexes.includes(idx))
            ?.value,
      ),
      (x) => [...new Set(x)],
      A.filter((x) => (x?.length || 0) > 0),
      (x) => ({
        value: input.value,
        numbers: x,
      }),
    );

const validateSymbols =
  (schematic: string[]) =>
  (
    index: number,
    input: {
      value: string;
      index: number;
    }[],
  ) =>
    pipe(
      input,
      A.map(findAdjacent(schematic, index)),
      A.map(matchSerialNumbers(parseSerialNumbers(schematic))),
      // A.flatten,
      A.map((x) => ({
        value: x.value,
        parts: x.numbers,
        total:
          x.numbers.length > 1
            ? x.numbers.reduce((a, b) => a * Number(b), 1)
            : 0,
      })),
    );

const searchSchematic = (input: string[]) =>
  pipe(
    input,
    A.map(findSymbols),
    A.mapWithIndex(validateSymbols(input)),
    A.flatten,
  );

export const main = (input: string) =>
  pipe(
    input,
    splitIntoArray,
    searchSchematic,
    A.reduce(0, (a, b) => a + Number(b.total)),
  );

// const input = fs.readFileSync("./src/day_3/input/input.txt", "utf8");

// console.log(`Part 2: ${main(input)}`);
