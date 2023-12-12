import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";
import exampleOne from "./input/example_1.txt";
import exampleTwo from "./input/example_2.txt";
import exampleThree from "./input/example_3.txt";
import exampleFour from "./input/example_4.txt";

describe("AoC: Day 10", () => {
  test("part 1", async () => {
    expect(partOne(exampleOne)).toBe(4);
    expect(partOne(exampleTwo)).toBe(8);
  });
  test("part 2", async () => {
    expect(partTwo(exampleOne)).toBe(1);
    expect(partTwo(exampleFour)).toBe(10);
    expect(partTwo(exampleThree)).toBe(8);
  });
});
