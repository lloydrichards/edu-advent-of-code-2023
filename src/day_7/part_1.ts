import { flow, identity, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as RA from "fp-ts/ReadonlyArray";
import * as E from "fp-ts/Either";
import * as A from "@fp-ts/array";
import * as N from "@fp-ts/number";
import * as R from "fp-ts/Record";
import * as Ord from "fp-ts/Ord";

import input from "./input/input.txt";

const parseHands = flow(
  S.split("\n"),
  RNEA.map(
    flow(S.split(" "), (parts) => ({
      hand: parts[0],
      bid: Number(parts[1]),
    })),
  ),
);

const enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

const CardValue: Record<string, string> = {
  A: "14",
  K: "13",
  Q: "12",
  J: "11",
  T: "10",
  "9": "09",
  "8": "08",
  "7": "07",
  "6": "06",
  "5": "05",
  "4": "04",
  "3": "03",
  "2": "02",
};

const isntOfAKind = (number: number) =>
  flow(
    S.split(""),
    (x) => [...x],
    A.countBy(S.toUpperCase),
    R.some((n) => n === number),
    (x) => !x,
  );

const isntFullHouse = flow(
  S.split(""),
  (x) => [...x],
  A.countBy(S.toUpperCase),
  Object.values,
  (x) => !(x.includes(2) && x.includes(3)),
);
const isntTwoPair = flow(
  S.split(""),
  (x) => [...x],
  A.countBy(S.toUpperCase),
  R.filter((n) => n === 2),
  R.size,
  (size) => size !== 2,
);

type Hand = {
  hand: string;
  type: HandType;
  bid: number;
};

const scoreHand = ({ hand, bid }: { hand: string; bid: number }) =>
  pipe(
    hand,
    E.fromPredicate(isntOfAKind(5), () => HandType.FiveOfAKind),
    E.chain(E.fromPredicate(isntOfAKind(4), () => HandType.FourOfAKind)),
    E.chain(E.fromPredicate(isntFullHouse, () => HandType.FullHouse)),
    E.chain(E.fromPredicate(isntOfAKind(3), () => HandType.ThreeOfAKind)),
    E.chain(E.fromPredicate(isntTwoPair, () => HandType.TwoPair)),
    E.chain(E.fromPredicate(isntOfAKind(2), () => HandType.OnePair)),
    E.match(identity, () => HandType.HighCard),
    (x) => ({
      hand,
      type: x,
      bid,
    }),
  );

const byType: Ord.Ord<Hand> = pipe(
  N.Ord,
  Ord.contramap((obj) => obj.type),
);
const byValue: Ord.Ord<Hand> = pipe(
  N.Ord,
  Ord.contramap((obj) =>
    pipe(
      obj.hand,
      S.split(""),
      RA.map((x) => CardValue[x]),
      (x) => x.join(""),
      Number,
    ),
  ),
);

const rankHands = flow(RNEA.sortBy([byType, byValue]));

export const main = (input: string) =>
  pipe(
    input,
    parseHands,
    RNEA.map(scoreHand),
    rankHands,
    RNEA.reduceWithIndex(0, (index, acc, hand) => acc + hand.bid * (index + 1)),
  );

console.log(`Part 1: ${main(input)}`);
