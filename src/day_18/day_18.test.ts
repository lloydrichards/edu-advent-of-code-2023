import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";

import example from "./input/example.txt";
import exampleTwo from "./input/example_2.txt";

describe("AoC: Day 18", () => {
  test("part 1", async () => {
    expect(partOne(example)).toEqual(62);
    // expect(partOne(exampleTwo)).toEqual(62);
  });
});
