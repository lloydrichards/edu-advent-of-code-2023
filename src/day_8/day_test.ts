import { describe, expect, test } from "bun:test";
import exampleOne from "./input/example_1.txt";
import exampleTwo from "./input/example_2.txt";
import exampleThree from "./input/example_3.txt";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

describe("AoC: Day 8", () => {
  test("part 1", async () => {
    expect(partOne(exampleOne)).toBe(2);
    expect(partOne(exampleTwo)).toBe(6);
  });
  test("part 2", async () => {
    expect(partTwo(exampleThree)).toBe(6);
  });
});
