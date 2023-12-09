import { describe, expect, test } from "bun:test";
import example from "./input/example.txt";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

describe("AoC: Day 9", () => {
  test("part 1", async () => {
    expect(partOne(example)).toBe(114);
  });
  test("part 2", async () => {
    expect(partTwo(example)).toBe(2);
  });
});
