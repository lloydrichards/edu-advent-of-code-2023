import { flow, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RA from "fp-ts/ReadonlyArray";

import input from "./input/input.txt";

const parseMap = flow(S.split("\n"), RA.map(flow(S.split(""), RA.toArray)));
export const main = (input: string) => pipe(input, parseMap);

// console.log(main(input)); // Output:
