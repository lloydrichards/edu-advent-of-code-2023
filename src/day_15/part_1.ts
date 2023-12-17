import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as N from "@fp-ts/number";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";

import input from "./input/input.txt";
import { traceWithValue } from "fp-ts-std/Debug";
const parseInput = flow(S.split(","), RNEA.map(S.split("")));

const holidayHash = flow(
  RNEA.reduce<string, number>(0, (acc, cur) =>
    pipe(cur.charCodeAt(0), N.add(acc), N.multiply(17), N.rem(256)),
  ),
);
export const main = (input: string) =>
  pipe(
    input,
    parseInput,
    RNEA.map(holidayHash),
    RNEA.reduce(0, (a, c) => a + c),
  );

// console.log(main(input)); // Output: 518107
