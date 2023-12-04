import { describe, expect, test } from "@jest/globals";
import * as fs from "fs";
import { main as partOne } from "./part_1";
import { main as partTwo } from "./part_2";

describe("AoC: Day 4", () => {
  test("part 1", () => {
    const example = fs.readFileSync("./src/day_4/input/example.txt", "utf8");
    expect(partOne(example)).toEqual(13);
  });
  test("part 2", () => {
    const example = fs.readFileSync("./src/day_4/input/example.txt", "utf8");
    expect(partTwo(example)).toEqual(30);
  });
});
