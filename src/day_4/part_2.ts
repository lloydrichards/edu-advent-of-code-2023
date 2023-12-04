import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";

const splitIntoGames = (input: string): string[] => input.split("\n");

type Game = {
  id: number;
  winning: number[];
  played: number[];
  score: number;
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
    O.bind("id", () => O.some(Number(input.split(":")[0].match(/\d+/g)![0]))),
    O.bind("winning", () => splitNumbers(input.split(": ")[1].split(" | ")[0])),
    O.bind("played", () => splitNumbers(input.split(": ")[1].split(" | ")[1])),
    O.bind("score", (game) => O.some(getMatching(game))),
    O.getOrElse(() => ({ id: 0, winning: [], played: [], score: 0 }) as Game),
  );

const getMatching = (game: { played: number[]; winning: number[] }) =>
  pipe(
    game.played,
    A.reduce(0, (score, num) =>
      game.winning.includes(num) ? score + 1 : score,
    ),
  );

const playGame = (games: Game[]) => {
  const score = Array(games.length).fill(1);
  games.map((game, i) => {
    return [...Array(game.score).keys()].forEach((offset) => {
      score[i + offset + 1] += score[i];
    });
  });
  return score.filter((n) => !Number.isNaN(n));
};

export const main = (input: string) =>
  pipe(
    input,
    splitIntoGames,
    A.map(parseGame),
    playGame,
    A.reduce(0, (a, b) => a + b),
  );

// const input = fs.readFileSync("./src/day_4/input/input.txt", "utf8");

// console.log(`Part 2: ${main(input)}`);
