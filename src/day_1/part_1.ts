import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";

import * as fs from "fs";

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
): number => Number(`${input[0]}${input[1]}`);

export const main = (input: string, separator: string = "\n"): number =>
  pipe(
    input,
    splitIntoArray(separator),
    A.map(findNumbers),
    A.map(firstAndLast),
    A.map(concatenateNumbers),
    A.reduce(0, (a, b) => a + b),
  );

const input = fs.readFileSync("./src/day_1/input/input.txt", "utf8");

// console.log(`Part 1: ${main(input)}`);
