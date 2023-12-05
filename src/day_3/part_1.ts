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

const findSymbols = (input: string) => input.match(/[^\d.]/g);

const clampSlice = (row: string | undefined, start: number, end: number) =>
  O.some(row?.slice(Math.max(0, start), Math.min(end, row.length - 1)) || "");

const findOverlap =
  (schematic: string[], index: number) =>
  (number: { value: string; index: number }) =>
    pipe(
      O.Do,
      O.bind("above", () =>
        clampSlice(
          schematic[index - 1],
          number.index - 1,
          number.value.length + number.index + 1,
        ),
      ),
      O.bind("same", () =>
        clampSlice(
          schematic[index],
          number.index - 1,
          number.value.length + number.index + 1,
        ),
      ),
      O.bind("below", () =>
        clampSlice(
          schematic[index + 1],
          number.index - 1,
          number.value.length + number.index + 1,
        ),
      ),
      O.bind("searchArea", ({ above, same, below }) =>
        O.some(`${above || ""}${same || ""}${below || ""}`),
      ),
      O.match(
        () => "missing",
        (x) => (findSymbols(x.searchArea) ? number.value : ""),
      ),
    );

const validateSerialNumbers =
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
      A.map(findOverlap(schematic, index)),
      A.filter((x) => x.length > 0),
    );

const searchSchematic = (input: string[]) =>
  pipe(
    input,
    A.map(findSerialNumbers),
    A.mapWithIndex(validateSerialNumbers(input)),
  );

export const main = (input: string) =>
  pipe(
    input,
    splitIntoArray,
    searchSchematic,
    A.flatMap((x) => x),
    A.reduce(0, (a, b) => a + Number(b)),
  );

// const input = Bun.file("./src/day_3/input/input.txt");

// console.log(`Part 1: ${main(input)}`);
