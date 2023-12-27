import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

import example from "./input/example.txt";

describe("AoC: Day 18", () => {
  test("part 1", async () => {
    expect(partOne(example)).toEqual(62);
  });
  test("part 2", async () => {
    expect(partTwo(example)).toEqual(952408144115);
  });
});
