import * as IO from 'fp-ts/lib/IO';

export const pureLog =
(message: string) =>
(x: number): IO.IO<number> =>
() => {
  console.log(`${message} ${x}`);
  return x;
};
