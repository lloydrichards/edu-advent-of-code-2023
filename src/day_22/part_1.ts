import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as N from "@fp-ts/number";
import * as RA from "fp-ts/ReadonlyArray";

import input from "./input/input.txt";

const parseBlocks = flow(
  S.split("\n"),
  RA.map(
    flow(
      S.split("~"),
      RA.map(flow(S.split(","), RA.map(Number), RA.toArray)),
      RA.toArray,
    ),
  ),
  RA.toArray,
);

export const main = (input: string) => pipe(input, parseBlocks);

// console.log(main(input)); // Output:
