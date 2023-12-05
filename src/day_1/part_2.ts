import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";

import * as fs from "fs";

const validDigit: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const splitIntoArray =
  (separator: string) =>
  (input: string): string[] =>
    input.split(separator);
const findNumbers = (input: string): number[] =>
  input.match(/\d/g)?.map(Number) || [];
const firstAndLast = (
  input: number[],
): [number | undefined, number | undefined] => [input.at(0), input.at(-1)];
const concatenateNumbers = (
  input: [number | undefined, number | undefined],
): number => Number(`${input[0] || ""}${input[1] || ""}`);

const replaceValidDigit = (input: string): string =>
  pipe(
    Object.keys(validDigit),
    A.flatMap((x) => [
      { value: x, index: input.indexOf(x) },
      { value: x, index: input.lastIndexOf(x) },
    ]),
    A.filter((x) => x.index !== -1),
    A.reduce(input, (a, b) => {
      const digit = validDigit[b.value];
      const digitIndex = b.index + digit.toString().length;
      const before = a.slice(0, b.index);
      const after = a.slice(digitIndex);
      return `${before}${digit}${after}`;
    }),
  );

export const main = (input: string, separator: string = "\n"): number =>
  pipe(
    input,
    splitIntoArray(separator),
    A.map(replaceValidDigit),
    A.map(findNumbers),
    A.map(firstAndLast),
    A.map(concatenateNumbers),
    A.reduce(0, (a, b) => a + b),
  );

const input = Bun.file("./src/day_1/input/input.txt");

// console.log(`Part 1: ${main(input)}`);
