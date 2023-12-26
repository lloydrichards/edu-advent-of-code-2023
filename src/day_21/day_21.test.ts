import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

import example from "./input/example.txt";

describe("AoC: Day 21", () => {
  test("part 1", async () => {
    expect(partOne(6)(example)).toEqual(16);
  });
  test.skip("part 2", async () => {
    expect(partTwo(6)(example)).toEqual(16);
    expect(partTwo(10)(example)).toEqual(50);
    expect(partTwo(50)(example)).toEqual(1594);
    expect(partTwo(100)(example)).toEqual(6536);
    expect(partTwo(500)(example)).toEqual(167004);
    expect(partTwo(1000)(example)).toEqual(668697);
    expect(partTwo(5000)(example)).toEqual(16733044);
  });
});
