import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";

const splitIntoGames = (input: string): string[] => input.split("\n");

type Game = {
  id: number;
  winning: number[];
  played: number[];
};

const splitNumbers = (input: string): O.Option<number[]> =>
  O.some(
    input
      .split(" ")
      .map(Number)
      .filter((x) => x > 0),
  );

const parseGame = (input: string): Game =>
  pipe(
    O.Do,
    O.bind("id", () => O.some(Number(input.split(":")[0].split(" ")[1]))),
    O.bind("winning", () => splitNumbers(input.split(": ")[1].split(" | ")[0])),
    O.bind("played", () => splitNumbers(input.split(": ")[1].split(" | ")[1])),
    O.getOrElse(() => ({ id: 0, winning: [], played: [] }) as Game),
  );

const scoreGame = (game: Game): number =>
  pipe(
    game.played,
    A.filter((x) => game.winning.includes(x)),
    (x) => x.length,
    (x) => (x == 0 ? 0 : x == 1 ? 1 : 2 ** (x - 1)),
  );

export const main = (input: string) =>
  pipe(
    input,
    splitIntoGames,
    A.map(parseGame),
    A.map(scoreGame),
    A.reduce(0, (a, b) => a + b),
  );

// const input = await Bun.file("./src/day_4/input/input.txt").text();

// console.log(`Part 1: ${main(input)}`);
