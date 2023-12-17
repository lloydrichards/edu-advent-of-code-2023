import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";

import example from "./input/example.txt";

describe("AoC: Day 15", () => {
  test("part 1", async () => {
    expect(partOne("HASH")).toEqual(52);
    expect(partOne(example)).toEqual(1320)
  });
});
