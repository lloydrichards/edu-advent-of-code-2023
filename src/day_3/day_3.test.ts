import { describe, expect, test } from "bun:test";
import { main as pastOne } from "./part_1";
import { main as pastTwo } from "./part_2";

describe("AoC: Day 3", () => {
  test("part 1", async () => {
    const example = await Bun.file(
      "./src/day_3/input/part_1_example.txt"
    ).text()
    expect(pastOne(example)).toEqual(4361);
  });
  test("part 1;  sample", async() => {
    const example = await Bun.file(
      "./src/day_3/input/input_sample.txt"
    ).text()
    expect(pastOne(example)).toEqual(10080);
  });
  test("part 2", async () => {
    const example = await Bun.file(
      "./src/day_3/input/part_1_example.txt"
    ).text()
    expect(pastTwo(example)).toEqual(467835);
  });
});
