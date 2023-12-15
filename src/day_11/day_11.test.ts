import { describe, expect, test } from "bun:test";

import exampleOne from "./input/example.txt";

import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

describe("AoC: Day 11", () => {
  test("part 1", async () => {
    expect(partOne(exampleOne)).toBe(374);
  });
  test("part 2", async () => {
    expect(partTwo(10)(exampleOne)).toBe(1030);
    expect(partTwo(100)(exampleOne)).toBe(8410);
  });
});
