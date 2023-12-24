import { flow, identity, pipe } from "fp-ts/lib/function";
import * as S from "@fp-ts/string";
import * as RA from "fp-ts/lib/ReadonlyArray";
import * as A from "fp-ts/lib/Array";
import * as R from "fp-ts/lib/Record";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";

import input from "./input/input.txt";
import { traceWithValue } from "fp-ts-std/Debug";

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};
type Rule = {
  type: string;
  value: number;
  rule: "<" | ">" | "=";
  dest: string;
};
type Workflows = Record<string, Array<Rule>>;
const parseParts = (raw: string): Array<Part> => {
  return raw
    .split("\n")
    .map((d) => d.replaceAll("{", "").replaceAll("}", ""))
    .map((d) => {
      const [x, m, a, s] = d.split(",").map((d) => +d.split("=")[1]);
      return { x, m, a, s };
    });
};

const parseRules = (raw: string): [string, Array<Rule>] => {
  const name = raw.split("{")[0];
  const rules = raw
    .split("{")[1]
    .split("}")[0]
    .split(",")
    .map((d) => {
      const [test, dest] = d.split(":");
      const rule = test.match(/(>|<)/)?.[0] as "<" | ">";
      if (!rule) {
        return {
          type: "dest",
          value: 0,
          rule: "=" as const,
          dest: test,
        };
      }
      const [type, value] = test.split(rule);
      return { type, value: +value, rule, dest };
    });
  return [name, rules] as const;
};

export const parseWorkflows: (s: string) => Workflows = flow(
  S.split("\n"),
  RA.map(parseRules),
  RA.toArray,
  R.fromEntries,
);

export const validatePart =
  (workflows: Workflows) =>
  (part: Part, startWorkflow?: string): string =>
    pipe(
      workflows[startWorkflow || "in"],
      A.map(
        E.fromPredicate(
          (rule) => {
            if (rule.rule === "=") {
              return false;
            }
            if (rule.rule === "<") {
              return !(part[rule.type as keyof Part] < rule.value);
            }
            if (rule.rule === ">") {
              return !(part[rule.type as keyof Part] > rule.value);
            }
            return true;
          },
          (rule) => rule.dest,
        ),
      ),
      A.reduce(E.right("unknown") as E.Either<string, Rule>, (acc, x) =>
        pipe(
          acc,
          E.chain(() => x),
        ),
      ),
      E.match(
        (l) =>
          pipe(
            O.fromPredicate(() => ["R", "A"].includes(l))(l),
            O.match(() => validatePart(workflows)(part, l), identity),
          ),
        () => "Unknown",
      ),
    );

export const main = (input: string) =>
  pipe(input, S.split("\n\n"), ([rules, parts]) =>
    pipe(
      parts,
      parseParts,
      A.map((part) =>
        pipe(
          part,
          validatePart(parseWorkflows(rules)),
          O.fromPredicate((x) => x === "A"),
          O.map(() => Object.values(part).reduce((a, b) => a + b, 0)),
          O.match(() => 0, identity),
        ),
      ),
      A.reduce(0, (a, b) => a + b),
    ),
  );

// console.log(main(input)); // Output: 397643
