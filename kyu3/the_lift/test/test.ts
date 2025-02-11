import { theLift } from '../solution';
import { expect } from 'chai';


const UP = 1;
const DOWN = 0;

const myAnswer = (queues: number[][], capacity: number, result: number[] = [0], direction: number = UP): number[] => {
  let peopleInLift: number[] = [];
  queues.map((queue, floor) => {
    floor = direction == DOWN ? queues.length - floor - 1 : floor;
    queue = queues[floor];
    let stoppedAtFloor = false;

    // Let people leave the lift.
    peopleInLift.reduceRight((acc, person, index, object): any => {
      if (person === floor) {
        object.splice(index, 1);
        stoppedAtFloor = true;
      }
    }, []);

    // Let people enter the lift.
    let count = 0;
    queues[floor] = queue.filter((person, index) => {
      if (
        ((person > floor) && direction) ||
        ((person < floor) && !direction)
      ) {
        stoppedAtFloor = true;
        if (capacity > peopleInLift.length) {
          count++;
          peopleInLift.push(person);
          return false;
        }
      }
      return true;
    });

    if (stoppedAtFloor && floor !== result.slice(-1)[0]) {
      result.push(floor);
    }
  });

  if (direction === UP || peopleInLift.length || queues.filter(q => q.length).length) {
    direction = direction === UP ? DOWN : UP;
    return myAnswer(queues, capacity, result, direction);
  }

  if (result.slice(-1)[0] !== 0) {
    result.push(0);
  }
  return result;
}


// ========================================================

describe("Solution Tests", function() {

  describe("Basic", function() {

    it("up", function() {
      let queues = [
        [], // G
        [], // 1
        [5,5,5], // 2
        [], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,2,5,0]);
    });

    it("down", function() {
      let queues = [
        [], // G
        [], // 1
        [1,1], // 2
        [], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,2,1,0]);
    });


    it("up and up", function() {
      let queues = [
        [], // G
        [3], // 1
        [4], // 2
        [], // 3
        [5], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,1,2,3,4,5,0]);
    });

    it("down and down", function() {
      let queues = [
        [], // G
        [0], // 1
        [], // 2
        [], // 3
        [2], // 4
        [3], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,5,4,3,2,1,0]);
    });

  });

  describe("Others", function() {

    it("up and down", function() {
      let queues = [
        [3], // G
        [2], // 1
        [0], // 2
        [2], // 3
        [], // 4
        [], // 5
        [5], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,1,2,3,6,5,3,2,0]);
    });

    it("yo-yo", function() {
      let queues = [
        [], // G
        [], // 1
        [4,4,4,4], // 2
        [], // 3
        [2,2,2,2], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,2);
      expect(result).to.have.members([0,2,4,2,4,2,0]);
    });

    it("enter on ground floor", function() {
      let queues = [
        [1,2,3,4], // G
        [], // 1
        [], // 2
        [], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,1,2,3,4,0]);
    });

    it("lift full (up)", function() {
      let queues = [
        [3,3,3,3,3,3], // G
        [], // 1
        [], // 2
        [], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,3,0,3,0]);
    });

    it("lift full (down)", function() {
      let queues = [
        [], // G
        [], // 1
        [], // 2
        [1,1,1,1,1,1,1,1,1,1,1], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,3,1,3,1,3,1,0]);
    });

    it("lift full (up and down)", function() {
      let queues = [
        [3,3,3,3,3,3], // G
        [], // 1
        [], // 2
        [], // 3
        [], // 4
        [4,4,4,4,4,4], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,3,5,4,0,3,5,4,0]);
    });

    it("tricky queues", function() {
      let queues = [
        [], // G
        [0,0,0,6], // 1
        [], // 2
        [], // 3
        [], // 4
        [6,6,0,0,0,6], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,1,5,6,5,1,0,1,0]);
    });

    it("highlander", function() {
      let queues = [
        [], // G
        [2], // 1
        [3,3,3], // 2
        [1], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,1);
      expect(result).to.have.members([0,1,2,3,1,2,3,2,3,0]);
    });

    it("fire drill!", function() {
      let queues = [
        [], // G
        [0,0,0,0], // 1
        [0,0,0,0], // 2
        [0,0,0,0], // 3
        [0,0,0,0], // 4
        [0,0,0,0], // 5
        [0,0,0,0], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0,6,5,4,3,2,1,0,5,4,3,2,1,0,4,3,2,1,0,3,2,1,0,1,0]);
    });

    it("empty", function() {
      let queues = [
        [], // G
        [], // 1
        [], // 2
        [], // 3
        [], // 4
        [], // 5
        [], // 6
      ];
      let result = theLift(queues,5);
      expect(result).to.have.members([0]);
    });

  });

  describe("Random Tests", function() {
    for (let r = 0; r < 20; r++) {
      let people = 0;
      let liftMax = 1 + Math.floor(Math.random() * 5);
      let floors = 2 + Math.floor(Math.random() * 20);
      let queues1: number[][] = []
      let queues2: number[][] = []; // copy
      for (let floor = 0; floor < floors; floor++) {
        let qlen = Math.floor(Math.random() * 5);
        let q1 = []
        let q2 = []
        for (let i = 0; i < qlen; ) {
          let wantFloor = Math.floor(Math.random() * floors);
          if (wantFloor == floor) continue; // cant catch lift to same floor! find another floor
          q1.push(wantFloor);
          q2.push(wantFloor);
          i++;
        }
        queues1.push(q1);
        queues2.push(q2);
        people += qlen;
      }

      it(`R#${r}: ${floors} floors, ${people} people, lift holds ${liftMax}`, function() {
        let expected = myAnswer(queues1, liftMax);
        let userResult = theLift(queues2, liftMax);
        expect(userResult).to.have.members(expected);
      });

    }

  });

});
