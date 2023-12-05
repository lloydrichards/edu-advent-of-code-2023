import { describe, expect, test } from "bun:test";
import { main as part1 } from "./part_1";
import { main as part2 } from "./part_2";

describe("AoC: Day 1", () => {
  test("part 1", () => {
    expect(part1("1abc2 pqr3stu8vwx a1b2c3d4e5f treb7uchet", " ")).toBe(142);
  });
  test("part 2", () => {
    expect(
      part2(
        `two1nine eightwothree abcone2threexyz xtwone3four 4nineeightseven2 zoneight234 7pqrstsixteen`,
        " ",
      ),
    ).toBe(281);
  });
  test("part 2.1", () => {
    expect(
      part2(
        `two1nine eightwothree abcone2threexyz xtwone3four 4nineeightseven2 zoneight234 7pqrstsixteen ninenineeightone4brmgnngchf`,
        " ",
      ),
    ).toBe(375);
  });
});
