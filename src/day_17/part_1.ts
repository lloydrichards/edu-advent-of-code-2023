import { pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import { flow } from "fp-ts/lib/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as A from "fp-ts/Array";
import { equals } from "fp-ts/Ord";
import * as Eq from "fp-ts/Eq";
import * as O from "fp-ts/Option";
import * as IO from "fp-ts/IO";
import * as Ord from "fp-ts/Ord";
import * as Sg from "fp-ts/Semigroup";

import input from "./input/input.txt";

const parseMap = flow(
  S.split("\n"),
  RA.map(flow(S.split(""), RA.toArray)),
  RA.toArray,
);

type PriorityQueue<T> = T[];

const getPriorityQueueOrd = <T>(
  ord: Ord.Ord<T>,
): Ord.Ord<PriorityQueue<T>> => ({
  equals: (x, y) =>
    x.length === y.length && x.every((val, index) => ord.equals(val, y[index])),
  compare: (x, y) => ord.compare(x[0], y[0]),
});

const enqueue =
  <T>(ord: Ord.Ord<T>) =>
  (queue: PriorityQueue<T>, element: T): PriorityQueue<T> => {
    const index = queue.findIndex((e) => ord.compare(e, element) === 1);
    if (index === -1) {
      return [...queue, element];
    }
    return [...queue.slice(0, index), element, ...queue.slice(index)];
  };

const dequeue = <T>(queue: PriorityQueue<T>): PriorityQueue<T> =>
  queue.slice(1);

const peek = <T>(queue: PriorityQueue<T>): T | undefined => queue[0];

const pathfinder =
  (start: [number, number]) =>
  (map: string[][]): [number, number] =>
    pipe(
      O.none,
      O.match(
        () => start,
        () => pathfinder(start)(map),
      ),
    );

export const main = (input: string) =>
  pipe(
    input,
    parseMap,
    pathfinder([0, 0]),
    A.head,
    O.match(
      () => 0,
      () => 1,
    ),
  );
