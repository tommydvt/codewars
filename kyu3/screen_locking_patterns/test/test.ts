import { expect } from "chai";

import { calculateCombinations } from "../solution";

describe("calculateCombinations", function() {
  it("basicInputs", function() {
    expect(calculateCombinations('A', 10)).to.equal(0);
    expect(calculateCombinations('A', 0)).to.equal(0);
    expect(calculateCombinations('E', 14)).to.equal(0);
    expect(calculateCombinations('B', 1)).to.equal(1);
    expect(calculateCombinations('C', 2)).to.equal(5);
    expect(calculateCombinations('E', 2)).to.equal(8);
  });

  it("someInputs", function() {
    expect(calculateCombinations('E', 4)).to.equal(256);
    expect(calculateCombinations('D', 3)).to.equal(37);
  });

  it("largeInputs", function() {
    expect(calculateCombinations('E', 8)).to.equal(23280);
  });

  it("randomTests", function() {
    const my = new MyScreenLock();
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "B"];
    letters.forEach(letter => {
      const patternLength = Math.floor(Math.random() * 10);
      expect(calculateCombinations(letter, patternLength)).to.equal(my.calculateCombinations(letter, patternLength));
    });
  });
});


class Point {
  constructor(
    readonly position: string,
    readonly x: number,
    readonly y: number,
  ) {}
}


class MyScreenLock {
  private readonly ALL_POINTS = [
      new Point("A", 0, 0),
      new Point("B", 1, 0),
      new Point("C", 2, 0),
      new Point("D", 0, 1),
      new Point("E", 1, 1),
      new Point("F", 2, 1),
      new Point("G", 0, 2),
      new Point("H", 1, 2),
      new Point("I", 2, 2),
  ];

  public calculateCombinations(startPosition: string, patternLength: number): number {
    if (patternLength < 1 || patternLength > 9) {
      return 0;
    }

    const startPoint = this.ALL_POINTS.find(p => p.position === startPosition);

    return this.calculateCombinationsRecursively(startPoint!, patternLength, this.removePoint(startPoint!, this.ALL_POINTS));
  }

  private calculateCombinationsRecursively(startPoint: Point, patternLength: number, remainingPoints: Point[]): number {
    if (patternLength === 1) {
      return 1;
    }

    let combinations = 0;
    remainingPoints.forEach(point => {
      if (this.canConnect(startPoint, point, remainingPoints)) {
        combinations += this.calculateCombinationsRecursively(point, patternLength - 1, this.removePoint(point, remainingPoints));
      }
    });
    return combinations;
  }

  private removePoint(point: Point, remainingPoints: Point[]): Point[] {
    return remainingPoints.filter(p => p !== point);
  }

  private canConnect(point1: Point, point2: Point, remainingPoints: Point[]): boolean {
    const xDistance = Math.abs(point1.x - point2.x);
    const yDistance = Math.abs(point1.y - point2.y);

    // horizontally / vertically
    if (xDistance + yDistance === 1) {
      return true;
    }

    // diagonally
    if (xDistance === 1 && yDistance === 1) {
      return true;
    }
    if (xDistance + yDistance === 3) {
      return true;
    }

    // pass over
    if (xDistance + yDistance === 2 || xDistance + yDistance === 4) {
      const blockingPoint = remainingPoints.find(p => p.x === Math.round((point1.x + point2.x) / 2) && p.y === Math.round((point1.y + point2.y) / 2));
      if (blockingPoint === undefined) {
        return true;
      }
    }

    return false;
  }
}