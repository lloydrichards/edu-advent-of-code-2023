import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";

const splitIntoArray = (input: string): string[] => input.split("\n");

const parseSet = (input: string) =>
  pipe(
    input.trim().split(", "),
    A.map((x) => x.split(" ").reverse()),
    A.map((x) => ({ [x[0]]: +x[1] })),
    A.reduce({}, (a, b) => ({ ...a, ...b })),
  );

const parseGame = (input: string) =>
  pipe(
    O.Do,
    O.bind("game", () => O.fromNullable(+input.split(":")[0].split(" ")[1])),
    O.bind("sets", () =>
      O.fromNullable(pipe(input.split(":")[1].split(";"), A.map(parseSet))),
    ),
    O.getOrElseW(() => {
      throw Error("Error");
    }),
  );

const validateSets =
  (game: Record<string, number>) => (sets: Record<string, number>[]) =>
    pipe(
      sets,
      A.map((x) =>
        pipe(
          Object.keys(x),
          A.map((y) => game[y] >= x[y]),
          A.every(Boolean),
        ),
      ),
      A.every(Boolean),
    );

export const main = (input: string) =>
  pipe(
    input,
    splitIntoArray,
    A.map(parseGame),
    A.map((x) =>
      pipe(
        x.game,
        O.fromPredicate(() =>
          validateSets({ red: 12, green: 13, blue: 14 })(x.sets),
        ),
      ),
    ),
    A.filter(O.isSome),
    A.map((x) => x.value),
    A.reduce(0, (a, b) => a + b),
  );

const input = fs.readFileSync("./src/day_2/input/input.txt", "utf8");

// console.log(`Part 1: ${main(input)}`);
