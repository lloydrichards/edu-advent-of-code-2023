import { pipe } from "fp-ts/lib/function";

import input from "./input/input.txt";

export const main = (input: string) => pipe(input);

// console.log(main(input)); // Output:
