import { describe,expect, test } from 'bun:test';
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

describe("AoC: Day 4", () => {
  test("part 1", async() => {
    const example = await Bun.file("./src/day_4/input/example.txt").text();
    expect(partOne(example)).toEqual(13);
  });
  test("part 2", async () => {
    const example = await Bun.file("./src/day_4/input/example.txt").text();
    expect(partTwo(example)).toEqual(30);
  });
});
