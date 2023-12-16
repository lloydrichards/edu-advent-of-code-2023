import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

import exampleOne from "./input/example_1.txt";
import exampleTwo from "./input/example_2.txt";

describe("AoC: Day 13", () => {
  test("part 1", async () => {
    expect(partOne(exampleOne)).toEqual(405);
    expect(partOne(exampleTwo)).toEqual(1310);
  });
  test("part 2", async () => {
    // expect(partTwo(exampleOne)).toEqual(400);
    // expect(partTwo(exampleTwo)).toEqual(1304);
  });
});
