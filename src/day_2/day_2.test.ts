import { describe, expect, test } from "bun:test";
import { main as pastOne } from "./part_1";
import { main as pastTwo } from "./part_2";

describe("AoC: Day 2", () => {
  test("part 1", async () => {
    const example = await Bun.file(
      "./src/day_2/input/part_1_example.txt",
      
    ).text()
    expect(pastOne(example)).toEqual(8);
  });
  test("part 2", async () => {
    const example = await Bun.file(
      "./src/day_2/input/part_1_example.txt",
      
    ).text()
    expect(pastTwo(example)).toEqual(2286);
  });
});
