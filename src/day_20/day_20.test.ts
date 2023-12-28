import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

import exampleOne from "./input/example_1.txt";
import exampleTwo from "./input/example_2.txt";
import input from "./input/input.txt";

describe("AoC: Day 20", () => {
  test("part 1", async () => {
    expect(partOne(1000)(exampleOne)).toEqual(32000000);
    expect(partOne(1000)(exampleTwo)).toEqual(11687500);
  });
  test.skip("part 2", async () => {
    expect(partTwo(input)).toEqual(32000000);
  });
});
