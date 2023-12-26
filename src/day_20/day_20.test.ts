import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";

import exampleOne from "./input/example_1.txt";
import exampleTwo from "./input/example_2.txt";

describe("AoC: Day 20", () => {
  test.skip("part 1", async () => {
    expect(partOne(exampleOne)).toEqual(32000000);
    expect(partOne(exampleTwo)).toEqual(11687500);
  });
});
