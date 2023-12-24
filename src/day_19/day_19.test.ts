import { describe, expect, test } from "bun:test";
import { main as partOne, validatePart, parseWorkflows } from "./part_1";
import { main as partTwo } from "./part_2";

import example from "./input/example.txt";

describe("AoC: Day 19", () => {
  test("part 1", async () => {
    const workflows = parseWorkflows(example.split("\n\n")[0]);
    expect(
      validatePart(workflows)({ x: 787, m: 2655, a: 1222, s: 2876 }),
    ).toEqual("A");
    expect(
      validatePart(workflows)({ x: 1679, m: 44, a: 2067, s: 496 }),
    ).toEqual("R");
    expect(
      validatePart(workflows)({ x: 2036, m: 264, a: 79, s: 2244 }),
    ).toEqual("A");
    expect(
      validatePart(workflows)({ x: 2461, m: 1339, a: 466, s: 291 }),
    ).toEqual("R");
    expect(
      validatePart(workflows)({ x: 2127, m: 1623, a: 2188, s: 1013 }),
    ).toEqual("A");

    expect(partOne(example)).toEqual(19114);
  });
  test.skip("part 2", async () => {
    expect(partTwo(example)).toEqual(167409079868000);
  });
});
