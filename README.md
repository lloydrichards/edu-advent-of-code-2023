# Advent of Code 2023

This repository contains my solutions to the
[Advent of Code](https://adventofcode.com/) puzzles in 2023.

I'm using this as an opportunity to improve my functional programming skills in
[fp-ts](https://gcanti.github.io/fp-ts/). I've setup a
[ts-node](https://typestrong.org/ts-node/) environment with
[Jest](https://jestjs.io/) for testing.

The solutions are in the `src` directory. Each day has its own directory, and
there is a solution for each part of the puzzle. The `input` directory contains
the puzzle input for each day.

## Running the code

To run the code, you'll need to install the dependencies:

```bash
yarn install
```

Then you can run the code for a given day:

```bash
npx ts-node src/day_1/part_1.ts
```

To run the tests:

```bash
yarn test
```
