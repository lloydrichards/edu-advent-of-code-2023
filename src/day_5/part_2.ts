import { flow, pipe } from "fp-ts/function";
import * as S from "@fp-ts/string";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as N from "@fp-ts/number";
import * as O from "fp-ts/Option";
import * as A from "@fp-ts/array";
import input from "./input/input.txt";

const stringToArrayOfNumbers = flow(
  S.words,
  RNEA.map(N.fromString),
  RNEA.map(O.getOrElse(() => 0)),
);

const parseSeedRanges = flow(
  S.split(": "),
  RNEA.last,
  stringToArrayOfNumbers,
  (array) =>
    RNEA.reduceWithIndex([] as Array<[number, number]>, (i, acc, x) => {
      if (i % 2 === 0) acc.push(array.slice(i, i + 2) as [number, number]);
      return acc;
    })(array),
  A.map(([start, range]) => [start, start + range] as [number, number]),
);

const parseRules = flow(
  S.split(":\n"),
  RNEA.last,
  S.split("\n"),
  RNEA.map(stringToArrayOfNumbers),
  RNEA.map((x) => ({
    source: [x[1], x[1] + x[2]] as [number, number],
    dest: [x[0], x[0] + x[2]] as [number, number],
    offset: x[0] - x[1],
  })),
);

const parseAlmanac = (input: string) =>
  pipe(input, S.split("\n\n"), (x) => ({
    seeds: parseSeedRanges(x[0]),
    rules: x.slice(1).map(parseRules),
  }));

const convertFp =
  (almanac: ReturnType<typeof parseAlmanac>) => (range: [number, number]) => {
    return pipe(
      almanac.rules,
      A.reduce(almanac.seeds, (ranges, maps) => {
        const newRanges: Array<[number, number]> = [];
        for (const current of ranges) {
          const [start, end] = current;
          let noCorrespondingMap = true;
          maps.forEach((map) => {
            const [outputStart, outputEnd] = map.dest;
            const [mapMin, mapMax] = map.source;
            const outputMin = outputStart + (start - mapMin);
            const outputMax = outputMin + (end - start);
            if (start >= mapMin && end <= mapMax) {
              noCorrespondingMap = false;
              newRanges.push([outputMin, outputMax]);
            } else if (start >= mapMin && start < mapMax && end > mapMax) {
              noCorrespondingMap = false;
              newRanges.push([outputMin, outputEnd]);
              ranges.push([mapMax, end]);
            } else if (start < mapMin && end > mapMin && end <= mapMax) {
              noCorrespondingMap = false;
              newRanges.push([outputStart, outputMax + (start - mapMin)]);
              ranges.push([start, mapMin]);
            }
          });
          if (noCorrespondingMap) {
            newRanges.push(current);
          }
        }
        return newRanges;
      }),
      A.map((x) => x[0]),
      A.reduce(Infinity, Math.min),
    );
  };

export const main = (input: string) =>
  pipe(input, parseAlmanac, (almanac) =>
    pipe(almanac.seeds, A.map(convertFp(almanac)), (x) => Math.min(...x)),
  );

// console.log(`Part 2: ${main(input)}`);
// console.log(`Part 2: ${main(example)}`);
