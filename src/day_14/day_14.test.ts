import { describe, expect, test } from "bun:test";
import { main as partOne } from "./part_1";

import example from "./input/example.txt";

describe("AoC: Day 14", () => {
  test("part 1", async () => {
    expect(partOne(example)).toEqual(136);
  });
});
