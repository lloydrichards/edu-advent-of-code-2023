import { describe, expect, test } from "@jest/globals";
import * as fs from "fs";
import { main as pastOne } from "./part_1";
import { main as pastTwo } from "./part_2";

describe("AoC: Day 2", () => {
  test("part 1", () => {
    const example = fs.readFileSync(
      "./src/day_2/input/part_1_example.txt",
      "utf8",
    );
    expect(pastOne(example)).toEqual(8);
  });
  test("part 2", () => {
    const example = fs.readFileSync(
      "./src/day_2/input/part_1_example.txt",
      "utf8",
    );
    expect(pastTwo(example)).toEqual(2286);
  });
});
